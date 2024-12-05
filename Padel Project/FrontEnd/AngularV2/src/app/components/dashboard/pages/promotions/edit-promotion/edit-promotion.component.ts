import { DashboardComponent } from './../../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../../services/promotions.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Promotion } from '../../../../../interfaces/promotion';
@Component({
  selector: 'app-edit-promotion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DashboardComponent,
  ],
  templateUrl: './edit-promotion.component.html',
  styleUrl: './edit-promotion.component.css'
})
export class EditPromotionComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promotionsService: PromotionsService,
    private dashboardComponent: DashboardComponent,
  ) {}

  formErrors: { [key: string]: string } = {};

  promotionOj: Promotion = {  // Usando a interface corretamente
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
  };

  promotion_id: number = 0;

  ngOnInit(): void {
    this.promotion_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadPromotion();
  }

  loadPromotion(): void {
    this.promotionsService.show(this.promotion_id).subscribe({
      next: (res: any) => {
        const promotion = res.promotion;

        this.promotionOj = {
          description:  promotion.description,
          promo_code: promotion.promo_code,
          usage_limit: promotion.usage_limit,
          min_spend: promotion.min_spend,
          discount: promotion.discount,
          for_inactive_users: promotion.for_inactive_users,
          for_new_users: promotion.for_new_users,
          additional_info: promotion.additional_info,
          start_date: promotion.start_date,
          end_date: promotion.end_date,
          generic: promotion.generic,
          active: promotion.active
        };

        console.log(this.promotionOj)
      },
      error: (err) => {
        const errorMessage = err?.error?.message

        this.dashboardComponent.showModal(
          'Error',
          errorMessage,
          () => {
            this.router.navigate(['/dashboard/courts']);
          }
        );
      }
    })
  }

  editPromotion(): void {
    this.promotionsService.edit(this.promotionOj, this.promotion_id).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.dashboardComponent.showModal(
            'Mensagem',
            res.message,
            () => {
              this.router.navigate(['/dashboard/promotions']);
            }
          );
          this.formErrors = {};
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        for (const promotion in errorDetails) {
          if (errorDetails.hasOwnProperty(promotion)) {
            this.formErrors[promotion] = errorDetails[promotion][0];
          }
        }
      }
    });
  }
}
