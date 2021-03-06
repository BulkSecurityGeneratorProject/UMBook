import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IMuro } from '../../shared/model/muro.model';
import { AccountService, IUser } from '../../core';
import { MuroService } from './muro.service';

@Component({
    selector: 'jhi-muro',
    templateUrl: './muro.component.html'
})
export class MuroComponent implements OnInit, OnDestroy {
    muros: IMuro[];
    muro: IMuro;
    currentAccount: any = [];
    muroAccount: any;
    eventSubscriber: Subscription;

    constructor(
        protected muroService: MuroService,
        protected jhiAlertService: JhiAlertService,
        protected eventManager: JhiEventManager,
        protected activatedRoute: ActivatedRoute,
        protected accountService: AccountService
    ) {}

    loadAll() {
        this.muroService
            .query()
            .pipe(
                filter((res: HttpResponse<IMuro[]>) => res.ok),
                map((res: HttpResponse<IMuro[]>) => res.body)
            )
            .subscribe(
                (res: IMuro[]) => {
                    let account: IUser;
                    if (this.muroAccount) {
                        account = this.muroAccount;
                    } else {
                        account = this.currentAccount;
                    }
                    this.muros = res;
                    if (this.muros) {
                        for (const muro of this.muros) {
                            if (muro.usuario.id == account.id) {
                                this.muro = muro;
                            }
                        }
                    }
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    clear() {
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.accountService.identity().then(account => {
            this.currentAccount = account;
        });
        this.activatedRoute.params.subscribe(params => {
            if (params['id'] && params['login']) {
                this.muroAccount = { id: params['id'], login: params['login'] };
            }
        });
        this.registerChangeInMuros();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    getUsuario() {
        if (this.muroAccount) {
            return this.currentAccount;
        } else {
            this.muro.usuario;
        }
    }

    trackId(index: number, item: IMuro) {
        return item.id;
    }

    registerChangeInMuros() {
        this.eventSubscriber = this.eventManager.subscribe('muroListModification', response => this.loadAll());
    }

    protected onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }
}
