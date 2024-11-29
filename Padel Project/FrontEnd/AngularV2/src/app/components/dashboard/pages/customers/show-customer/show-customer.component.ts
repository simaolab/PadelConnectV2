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
  selector: 'app-show-customer',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
    DashboardComponent,
  ],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.css'
})
export class ShowCustomerComponent {
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
}
