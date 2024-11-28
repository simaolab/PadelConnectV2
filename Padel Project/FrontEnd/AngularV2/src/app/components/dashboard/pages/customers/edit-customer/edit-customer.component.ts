import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../../services/users.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardFormComponent,
    TitlePageComponent,
    DashboardComponent
  ],
  templateUrl: './edit-customer.component.html',
  styleUrl: './edit-customer.component.css'
})
export class EditCustomerComponent {

  formErrors: { [key: string]: string } = {};

  customerObj = {
    email: '',
    username: '',
    nif: 0,
    birthday: '',
    last_login: '',
    email_verified_at: '',
    new_user: false,
    user_blocked: false,
    blocked_at: '',
    role: ''
  };

  customer_id: number = 0;

    constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private usersService: UsersService,
      private dashboardComponent: DashboardComponent
    ) {}

    ngOnInit(): void {
      this.customer_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
      this.showCustomer();
    }

    showCustomer(): void {

      this.usersService.show(this.customer_id).subscribe({
        next: (customer: any) => {

          console.log(customer)
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
            role: customer.user.role.name
          };
        },
        error: (err) => {
          const errorMessage = err?.error?.message

          this.dashboardComponent.showModal(
            'Error',
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
          if(res.status === 'success') {
            this.dashboardComponent.showModal(
              'Message',
              res.message,
              () => {
                this.router.navigate(['/dashboard/courts']);
              }
            );
            this.formErrors = {}
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
      })
    }
}
