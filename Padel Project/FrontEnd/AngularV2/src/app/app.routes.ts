import { Routes } from '@angular/router';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AboutPageComponent } from './components/pages/about-page/about-page.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { CourtsPageComponent } from './components/pages/courts-page/courts-page.component';
import { PrivacyPolicyPageComponent } from './components/pages/privacy-policy-page/privacy-policy-page.component';
import { PadelRulesComponent } from './components/pages/padel-rules/padel-rules.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { PaymentPageComponent } from './components/pages/payment-page/payment-page.component';

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
import { CustomersComponent } from './components/dashboard/pages/customers/customers.component';
import { SettingsComponent } from './components/dashboard/pages/settings/settings.component';
import { DetailsPageComponent } from './components/pages/details-page/details-page.component';
import { CancellationsComponent } from './components/dashboard/pages/cancellations/cancellations.component';

//CRUD COMPANY
import { CreateCompanyComponent } from './components/dashboard/pages/companies/create-company/create-company.component';
import { ShowCompanyComponent } from './components/dashboard/pages/companies/show-company/show-company.component';
import { EditCompanyComponent } from './components/dashboard/pages/companies/edit-company/edit-company.component';

//CRUD COURT
import { CreateCourtComponent } from './components/dashboard/pages/courts/create-court/create-court.component';
import { ShowCourtComponent } from './components/dashboard/pages/courts/show-court/show-court.component';
import { EditCourtComponent } from './components/dashboard/pages/courts/edit-court/edit-court.component';

//CRUD USER
import { ShowCustomerComponent } from './components/dashboard/pages/customers/show-customer/show-customer.component';
import { EditCustomerComponent } from './components/dashboard/pages/customers/edit-customer/edit-customer.component';

//CRUD PROMOTIONS
import { CreatePromotionComponent } from './components/dashboard/pages/promotions/create-promotion/create-promotion.component';
import { EditPromotionComponent } from './components/dashboard/pages/promotions/edit-promotion/edit-promotion.component';

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
  {
    path: 'padel-rules',
    component: PadelRulesComponent,
    title: 'Regras de Padel'
  },
  { path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'court/:id',
    component: DetailsPageComponent,
    title: 'Detalhes do Campo',
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    component: CartPageComponent,
    title: 'Carrinho'
  },
  {
    path: 'payment',
    component: PaymentPageComponent,
    title: 'Pagamento'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [authGuard],
    children: [
      //CRUD PAGES
      { path: 'main', component: MainComponent },
      { path: 'reservations', component: ReservationsComponent, title: 'Dashboard - Reservas' },
      { path: 'cancellations', component: CancellationsComponent, title: 'Dashboard - Cancelamentos'},
      { path: 'companies', component: CompaniesComponent, title: 'Dashboard - Empresas',
        canActivate: [roleGuard] },
      { path: 'courts', component: CourtsComponent, title: 'Dashboard - Campos',
        canActivate: [roleGuard] },
      { path: 'customers', component: CustomersComponent, title: 'Dashboard - Clientes',
        canActivate: [roleGuard] },
      { path: 'promotions', component: PromotionsComponent, title: 'Dashboard - Promoções' },
      { path: 'settings', component: SettingsComponent, title: 'Dashboard - Definições' },

      //CRUD COMPANY
      { path: 'create-company', component: CreateCompanyComponent, title: 'Dashboard - Adicionar Empresa',
        canActivate: [roleGuard]
       },
      { path: 'company/:id', component: ShowCompanyComponent, title: 'Dashboard - Detalhes Empresa',
        canActivate: [roleGuard]
      },
      { path: 'company/:id/edit', component: EditCompanyComponent, title: 'Dashboard - Editar Empresa',
        canActivate: [roleGuard]
      },

      //CRUD COURT
      { path: 'create-court', component: CreateCourtComponent, title: 'Dashboard - Adicionar Campo',
        canActivate: [roleGuard]
      },
      { path: 'court/:id', component: ShowCourtComponent, title: 'Dashboard - Detalhes Campo',
        canActivate: [roleGuard]
      },
      { path: 'court/:id/edit', component: EditCourtComponent, title: 'Dashboard - Editar Campo',
        canActivate: [roleGuard]
      },

      //CRUD CUSTOMER
      { path: 'customer/:id', component: ShowCustomerComponent, title: 'Dashboard - Detalhes Utilizador',
        canActivate: [roleGuard]
      },
      { path: 'customer/:id/edit', component: EditCustomerComponent, title: 'Dashboard - Editar Utilizador',
        canActivate: [roleGuard]
      },

      //CRUD PROMOTION
      { path: 'create-promotion', component: CreatePromotionComponent, title: 'Dashboard - Adicionar Promoção',
        canActivate: [roleGuard]
      },
      { path: 'promotion/:id', component: EditPromotionComponent, title: 'Dashboard - Detalhes Promoção',
        canActivate: [roleGuard]
      },
      //MAIN PAGE
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
