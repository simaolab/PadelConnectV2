import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { CourtsPageComponent } from './components/courts-page/courts-page.component';

import { LoginComponent } from './components/login/login.component';

import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { MainComponent } from './components/dashboard/main/main.component';
import { ReservationsComponent } from './components/dashboard/reservations/reservations.component';
import { CourtsComponent } from './components/dashboard/courts/courts.component';
import { PromotionsComponent } from './components/dashboard/promotions/promotions.component';
import { StatisticsComponent } from './components/dashboard/statistics/statistics.component';
import { CustomersComponent } from './components/dashboard/customers/customers.component';
import { SettingsComponent } from './components/dashboard/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'PadelConnect'
  },
  {
    path: 'courts',
    component: CourtsPageComponent,
    title: 'Campos'
  },
  {
    path: 'about-us',
    component: AboutPageComponent,
    title: 'Sobre nós'
  },
  {
    path: 'contact-us',
    component: ContactPageComponent,
    title: 'Contactos'
  },
  { path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    children: [
      { path: 'main', component: MainComponent },
      { path: 'reservations', component: ReservationsComponent, title: 'Dashboard - Reservas' },
      { path: 'courts', component: CourtsComponent, title: 'Dashboard - Campos' },
      { path: 'promotions', component: PromotionsComponent, title: 'Dashboard - Promoções' },
      { path: 'statistics', component: StatisticsComponent, title: 'Dashboard - Estatísticas' },
      { path: 'customers', component: CustomersComponent, title: 'Dashboard - Clientes' },
      { path: 'settings', component: SettingsComponent, title: 'Dashboard - Definições' },

      { path: '', redirectTo: 'main', pathMatch: 'full' },
    ]
  },
];
