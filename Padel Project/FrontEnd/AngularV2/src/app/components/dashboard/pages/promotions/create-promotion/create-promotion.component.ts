import { DashboardComponent } from './../../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Promotion } from '../../../../../interfaces/promotion';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';

@Component({
  selector: 'app-create-promotion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
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

  todayDate: string = new Date().toISOString().split('T')[0];
  formErrors: { [key: string]: string } = {};

    promotionObj: Promotion = {
      description: '',
      promo_code: '',
      usage_limit: 1,
      min_spend: 1,
      discount: 0,
      for_inactive_users: 0,
      for_new_users: 0,
      additional_info: null,
      start_date: '',
      end_date: '',
      generic: 1,
      active: 1
    }

  create(): void {

    this.promotionsService.create(this.promotionObj).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Successo',
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
