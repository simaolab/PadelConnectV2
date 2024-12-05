import { DashboardComponent } from './../../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Promotion } from '../../../../../interfaces/promotion';

@Component({
  selector: 'app-create-promotion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DashboardComponent,
  ],
  templateUrl: './create-promotion.component.html',
  styleUrl: './create-promotion.component.css'
})
export class CreatePromotionComponent {

  constructor(
    private router: Router,
    private promotionsService: PromotionsService,
    private dashboardComponent: DashboardComponent,
  ) {}

  formErrors: { [key: string]: string } = {};

    promotionOj: Promotion = {
      description: '',
      promo_code: '',
      usage_limit: 0,
      min_spend: 0,
      discount: 0,
      for_inactive_users: false,
      for_new_users: false,
      additional_info: null,
      start_date: '',
      end_date: '',
      generic: false,
      active: false
    }

  createPromotion(): void {
    this.promotionsService.create(this.promotionOj).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Success',
            res.message,
            () => {
              this.router.navigate(['/dashboard/courts']);
            }
          );
          this.formErrors = {};
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        console.error(err.error)

        for (const promotion in errorDetails) {
          if (errorDetails.hasOwnProperty(promotion)) {
            this.formErrors[promotion] = errorDetails[promotion][0];
          }
        }
      }
    });
  }
}
