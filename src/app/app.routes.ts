import { Routes } from '@angular/router';
import { ParkList } from './components/park-list/park-list';
import { CreatePark } from './components/create-park/create-park';

export const routes: Routes = [
    { 
        path: '',
        redirectTo: '/parques',
        pathMatch: 'full' 
    },
    { 
        path: 'parques',
        component: ParkList
    },
    { 
        path: 'parques/crear',
        component: CreatePark
    },
    {
        path: 'parques/editar/:id',
        component: CreatePark
    },
];
