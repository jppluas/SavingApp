import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { FinancesComponent } from '../finances/finances.component';
import { AboutComponent } from '../about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'finances',
        loadComponent: () =>
          import('../finances/finances.component').then((m) => m.FinancesComponent),
      },
      {
        path: 'financeModal',
        loadComponent: () =>
          import('../finances/finance-modal.component').then((m) => m.FinanceModalComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../user-profile/user-profile.component').then((m) => m.UserProfileComponent),
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../about/about.component').then((m) => m.AboutComponent),
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
];
