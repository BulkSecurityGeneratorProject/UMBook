import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Muro } from 'app/shared/model/muro.model';
import { MuroService } from './muro.service';
import { MuroComponent } from './muro.component';
import { MuroDetailComponent } from './muro-detail.component';
import { MuroUpdateComponent } from './muro-update.component';
import { MuroDeletePopupComponent } from './muro-delete-dialog.component';
import { IMuro } from 'app/shared/model/muro.model';

@Injectable({ providedIn: 'root' })
export class MuroResolve implements Resolve<IMuro> {
    constructor(private service: MuroService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IMuro> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Muro>) => response.ok),
                map((muro: HttpResponse<Muro>) => muro.body)
            );
        }
        return of(new Muro());
    }
}

export const muroRoute: Routes = [
    {
        path: 'muro/:id/:login',
        component: MuroComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Muro'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/view',
        component: MuroDetailComponent,
        resolve: {
            muro: MuroResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Muros'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'new',
        component: MuroUpdateComponent,
        resolve: {
            muro: MuroResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Muros'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/edit',
        component: MuroUpdateComponent,
        resolve: {
            muro: MuroResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Muros'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const muroPopupRoute: Routes = [
    {
        path: ':id/delete',
        component: MuroDeletePopupComponent,
        resolve: {
            muro: MuroResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Muros'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
