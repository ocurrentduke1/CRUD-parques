import { Routes } from '@angular/router';
import { ParkList } from './components/park-list/park-list';
import { CreatePark } from './components/create-park/create-park';
import { ParkCard } from './components/park-card/park-card';

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
    {
        path: 'parques/detalle/:id',
        component: ParkCard
    }
];
