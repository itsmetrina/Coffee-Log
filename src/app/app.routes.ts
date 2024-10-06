import { Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CoffeeComponent } from './coffee/coffee.component';

export const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'coffee', component: CoffeeComponent },
    { path: 'coffee/:id', component: CoffeeComponent }
    // { path: 'coffee/:year/:month/:date/:id', component: LogComponent }
];