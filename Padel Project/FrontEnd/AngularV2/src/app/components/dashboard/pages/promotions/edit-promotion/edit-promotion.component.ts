import { DashboardComponent } from './../../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../../services/promotions.service';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Promotion } from '../../../../../interfaces/promotion';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';

@Component({
  selector: 'app-edit-promotion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
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

  todayDate: string = new Date().toISOString().split('T')[0];
  formErrors: { [key: string]: string } = {};

  promotionObj: Promotion = { 
    description: '',
    promo_code: '',
    usage_limit: 0,
    min_spend: 0,
    discount: 0,
    for_inactive_users: 0,
    for_new_users: 0,
    additional_info: null,
    start_date: '',
    end_date: '',
    generic: 0,
    active: 0
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

        this.promotionObj = {
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

  edit(): void {

    this.promotionObj.min_spend = parseFloat(this.promotionObj.min_spend as any) || 0.0;
    this.promotionObj.discount = parseFloat(this.promotionObj.discount as any) || 0.0;

    this.promotionsService.edit(this.promotionObj, this.promotion_id).subscribe({
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

  formatDiscount(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9\.]/g, '');
    if ((value.match(/\./g) || []).length > 1) {
      value = value.replace(/\.$/, '');
    }
    if (value.length > 2 && !value.includes('.')) {
      value = value.slice(0, 2) + '.' + value.slice(2);
    }
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      value = integerPart + '.' + (decimalPart.length > 2 ? decimalPart.substring(0, 2) : decimalPart);
    }

    input.value = value;
    this.promotionObj.discount = value ? parseFloat(value) : 0;
  }

  formatUseLimit(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    input.value = value;
    this.promotionObj.usage_limit = parseInt(value, 10) || 0;
  }

  formatMinSpend(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9\.]/g, '');
    if ((value.match(/\./g) || []).length > 1) {
      value = value.replace(/\.$/, '');
    }
    if (value.length > 3 && !value.includes('.')) {
      value = value.slice(0, 3) + '.' + value.slice(3);
    }
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      value = integerPart + '.' + (decimalPart.length > 2 ? decimalPart.substring(0, 2) : decimalPart);
    }

    input.value = value;
    this.promotionObj.min_spend = value ? parseFloat(value) : 0;
  }

  toggleGeneric(event: Event): void {
    this.promotionObj.generic = (event.target as HTMLInputElement).checked ? 1 : 0;
    this.promotionObj.for_new_users = 0;
    this.promotionObj.for_inactive_users = 0;
  }

  toggleNewUsers(event: Event): void {
    this.promotionObj.for_new_users = (event.target as HTMLInputElement).checked ? 1 : 0;

    if (this.promotionObj.for_new_users) {
      this.promotionObj.generic = 0;
    }
    else if (!this.promotionObj.for_new_users && this.promotionObj.for_inactive_users){
      this.promotionObj.generic = 0;
    }
    else{
      this.promotionObj.generic = 1
    }
  }

  toggleInactiveUsers(event: Event): void {
    this.promotionObj.for_inactive_users = (event.target as HTMLInputElement).checked ? 1 : 0;

    if (this.promotionObj.for_inactive_users) {
      this.promotionObj.generic = 0;
    }
    else if (this.promotionObj.for_new_users && !this.promotionObj.for_inactive_users){
      this.promotionObj.generic = 0;
    }
    else{
      this.promotionObj.generic = 1
    }
  }

  toggleVisibility(event: Event): void {
    this.promotionObj.active = (event.target as HTMLInputElement).checked ? 1 : 0;
  }
}
