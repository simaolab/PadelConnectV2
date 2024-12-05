import { DashboardComponent } from './../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CommonModule } from '@angular/common';

import { AddButtonComponent } from '../../utilities/add-button/add-button.component';
import { Promotion } from '../../../../interfaces/promotion';

@Component({
  selector: 'promotions',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TitlePageComponent,
    AddButtonComponent
  ],
  templateUrl: './promotions.component.html',
  styleUrl: './promotions.component.css'
})
export class PromotionsComponent {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private promotionsService: PromotionsService,
    private dashboardComponent: DashboardComponent
  ) {}

  promotions: any[] = [];
  promotion_id: number = 0;

  formErrors: { [key: string]: string } = {};
  isLoading = true;

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

  ngOnInit(): void {
    this.promotion_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promotionsService.index().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.promotions = data.promotions || [];
          this.isLoading = false;
        }, 1500)

      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal(
          'Erro',
          message
        )
      }
    });
  }

  createPromotion(): void {
    this.promotionsService.create(this.promotionOj).subscribe({
      next: (res: any) => {
        this.dashboardComponent.showModal(
          'Sucess',
          res.message
        )
      },
      error: (err: any) => {
        const message = err.error.message;

        this.dashboardComponent.showModal(
          'Error',
          message
        )
      }
    });
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
