import { Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { CourtsPageComponent } from './components/pages/courts-page/courts-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';

import { LoginComponent } from './components/login/login.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';

import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { MainComponent } from './components/dashboard/pages/main/main.component';
import { ReservationsComponent } from './components/dashboard/pages/reservations/reservations.component';
import { CompaniesComponent } from './components/dashboard/pages/companies/companies.component';
import { CourtsComponent } from './components/dashboard/pages/courts/courts.component';
import { PromotionsComponent } from './components/dashboard/pages/promotions/promotions.component';
import { StatisticsComponent } from './components/dashboard/pages/statistics/statistics.component';
import { CustomersComponent } from './components/dashboard/pages/customers/customers.component';
import { SettingsComponent } from './components/dashboard/pages/settings/settings.component';

//CRUD COMPANY
import { CreateCompanyComponent } from './components/dashboard/pages/companies/create-company/create-company.component';

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
  {
    path: 'privacy-policy',
    component: PrivacyPolicyPageComponent,
    title: 'Política de privacidade'
  },
  { path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [authGuard],
    children: [
      { path: 'main', component: MainComponent },
      { path: 'reservations', component: ReservationsComponent, title: 'Dashboard - Reservas' },
      { path: 'companies', component: CompaniesComponent, title: 'Dashboard - Empresas',
        canActivate: [roleGuard] },
      { path: 'courts', component: CourtsComponent, title: 'Dashboard - Campos',
        canActivate: [roleGuard] },
      { path: 'statistics', component: StatisticsComponent, title: 'Dashboard - Estatísticas',
        canActivate: [roleGuard] },
      { path: 'customers', component: CustomersComponent, title: 'Dashboard - Clientes',
        canActivate: [roleGuard] },
      { path: 'promotions', component: PromotionsComponent, title: 'Dashboard - Promoções' },
      { path: 'settings', component: SettingsComponent, title: 'Dashboard - Definições' },

      { path: 'create-company', component: CreateCompanyComponent, title: 'Dashboard - Adicionar Empresa' },


      { path: '', redirectTo: 'main', pathMatch: 'full' },
    ]
  },
  { path: 'unauthorized',
    component: UnauthorizedComponent,
    title: '401 - unauthorized'
  },
  {
    path: 'error-page',
    component: ErrorPageComponent,
    title: 'Error'
  }
];
