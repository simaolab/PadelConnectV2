import { RolesService } from './../../../../../services/roles.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../../services/users.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { DropdownComponent } from '../../../utilities/dropdown/dropdown.component';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardFormComponent,
    TitlePageComponent,
    DashboardComponent,
    DropdownComponent
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {

  roles: any[] = [];
  formErrors: { [key: string]: string } = {};

  customerObj = {
    email: '',
    username: '',
    nif: 0,
    birthday: '',
    last_login: '',
    email_verified_at: '',
    new_user: 0,
    user_blocked: 0,
    blocked_at: null,
    role_id: ''
  };

  userStateOptions = [
    { label: 'Novo Utilizador', value: 'Novo Utilizador' },
    { label: 'Ativo', value: 'Ativo' },
    { label: 'Bloqueado', value: 'Bloqueado' },
  ];

  user_state: string = '';

  customer_id: number = 0;

    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private usersService: UsersService,
      private rolesService: RolesService,
      private dashboardComponent: DashboardComponent
    ) {}

    ngOnInit(): void {
      this.customer_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.showCustomer();
      this.loadRoles();
    }

    showCustomer(): void {

      this.usersService.show(this.customer_id).subscribe({
        next: (customer: any) => {

          this.customerObj = {
            email: customer.user.email,
            username: customer.user.username,
            nif: customer.user.nif,
            birthday: customer.user.birthday,
            last_login: customer.user.last_login_at,
            email_verified_at: customer.user.email_verified_at,
            new_user: customer.user.new_user,
            user_blocked: customer.user.user_blocked,
            blocked_at: customer.user.blocked_at,
            role_id: customer.user.role.id,
          };

          if (this.customerObj.new_user) {
            this.user_state = 'Novo Utilizador';
          } else if (this.customerObj.user_blocked) {
            this.user_state = 'Bloqueado';
          } else {
            this.user_state = 'Ativo';
          }
        },
        error: (err) => {
          const errorMessage = err?.error?.message

          this.dashboardComponent.showModal(
            'Erro',
            errorMessage,
            () => {
              this.router.navigate(['/dashboard/customers']);
            }
          );
        }
      })
    }

    editCustomer(): void {

      this.usersService.edit(this.customerObj, this.customer_id).subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.dashboardComponent.showModal(
              'Mensagem',
              res.message,
              () => {
                this.router.navigate(['/dashboard/customers']);
              }
            );
            this.formErrors = {};
          }
        },
        error: (err: any) => {
          this.formErrors = {};
          const errorDetails = err.error?.['error(s)'] || {};

          for (const company in errorDetails) {
            if (errorDetails.hasOwnProperty(company)) {
              this.formErrors[company] = errorDetails[company][0];
            }
          }
        }
      });
    }

    loadRoles(): void {
      this.rolesService.index().subscribe({
        next: (res: any) => {
          this.roles = res.roles;
        },
        error: (err: any) => {
          const message = err.error?.message || 'Erro ao carregar as roles';
          console.error(message);
        }
      })
    }

    getUserStatus(customer: any): string {
      if (customer.user_blocked) {
        return 'Bloqueado';
      }
      if (customer.new_user) {
        return 'Novo Utilizador';
      }
      return 'Ativo';
    }

    onUserStateSelected(selected: any): void {
      if (selected.value === 'Novo Utilizador') {
        this.customerObj.new_user = 1;
        this.customerObj.user_blocked = 0;
      } else if (selected.value === 'Ativo') {
        this.customerObj.new_user = 0;
        this.customerObj.user_blocked = 0;
      } else if (selected.value === 'Bloqueado') {
        this.customerObj.new_user = 0;
        this.customerObj.user_blocked = 1;
      }
    }

    onRoleSelected(event: any): void {
      this.customerObj.role_id = event.id;
    }
}
