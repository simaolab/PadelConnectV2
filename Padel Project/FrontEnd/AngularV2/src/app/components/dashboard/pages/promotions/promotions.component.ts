import { DashboardComponent } from './../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../services/promotions.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CommonModule } from '@angular/common';

import { AddButtonComponent } from '../../utilities/add-button/add-button.component';
import { Promotion } from '../../../../interfaces/promotion';
import { UsersService } from '../../../../services/users.service';

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
    private dashboardComponent: DashboardComponent,
    private usersService: UsersService
  ) {}

  promotions: any[] = [];
  isLoading = true;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.loadPromotions();
    this.userInfo();
  }

  userInfo(): void {
    this.usersService.userInfo().subscribe({
      next: (data: any) => {
        this.isAdmin = data.isAdmin || false;
      },
      error: () => {
        this.isAdmin = false;
      },
    });
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

  loadQuickPromotions(): void {
    this.promotionsService.index().subscribe({
      next: (data: any) => {
        this.promotions = data.promotions || [];
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


  togglePromotionField(promotion: any, field: string, event: Event): void {

    event.preventDefault();
    promotion.discount = parseInt(promotion.discount.replace('%', ''), 10);
    promotion[field] = promotion[field] === 1 ? 0 : 1;

    if (field === 'for_new_users' || field === 'for_inactive_users') {
      if (promotion.for_new_users === 0 && promotion.for_inactive_users === 0) {
        promotion.generic = 1;
      }
    }

    if (field === 'generic') {
      if (promotion.generic === 0) {
        promotion.active = 0;
      }
    }

    this.promotionsService.update(promotion.id, promotion).subscribe({
      next: (res: any) => {
        const index = this.promotions.findIndex(p => p.id === promotion.id);
        if (index !== -1) {
          setTimeout(() => {
            this.promotions[index] = res.promotion;
            this.loadQuickPromotions();
          }, 200);
        }
      },
      error: (err: any) => {
        console.log(err);
        const message = err.error?.message || 'Erro ao atualizar a promoção.';
        this.dashboardComponent.showModal('Erro', message);
      }
    });
  }

  deletePromotion(promotionId: number, event: Event): void {
    event.preventDefault();
    this.promotionsService.delete(promotionId).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.promotions = this.promotions.filter(promotion => promotion.id !== promotionId);
          this.dashboardComponent.showModal(
            'Mensagem',
            res.message,
            () => {
              this.router.navigate(['/dashboard/promotions']);
            }
          );
        }
      },
      error: (err: any) => {
        const message = err.error?.message || 'Erro ao apagar a promoção.';
        this.dashboardComponent.showModal('Erro', message);
      }
    });
  }
}
