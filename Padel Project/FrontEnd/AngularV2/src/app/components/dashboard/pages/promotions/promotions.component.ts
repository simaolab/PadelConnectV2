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
  isLoading = true;


  ngOnInit(): void {
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


  toggleVisibility(promotion: any, event: Event): void {
    event.preventDefault();
    promotion.discount = parseInt(promotion.discount.replace('%', ''), 10);
    promotion.active = promotion.active === 1 ? 0 : 1; 
    this.promotionsService.update(promotion.id, promotion).subscribe({
      next: (res: any) => {
        const index = this.promotions.findIndex(p => p.id === promotion.id);
        if (index !== -1) {
          setTimeout(() => {
            this.promotions[index] = res.promotion;
            this.loadQuickPromotions();
          }, 200)
        }
      },
      error: (err: any) => {
        console.log(err);
        const message = err.error?.message || 'Erro ao atualizar a promoção.';
        this.dashboardComponent.showModal('Erro', message);
      }
    });
  }
  
  toggleNewUserStatus(promotion: any, event: Event): void {
    event.preventDefault();

    promotion.discount = parseInt(promotion.discount.replace('%', ''), 10);
    promotion.for_new_users = promotion.for_new_users === 1 ? 0 : 1;

    if (promotion.for_new_users === 0 && promotion.for_inactive_users === 0) {
      promotion.generic = 1;
    }

    this.promotionsService.update(promotion.id, promotion).subscribe({
      next: (res: any) => {
        const index = this.promotions.findIndex(p => p.id === promotion.id);
        if (index !== -1) {
          setTimeout(() => {
            this.promotions[index] = res.promotion;
            this.loadQuickPromotions();
          }, 200)
        }
      },
      error: (err: any) => {
        const message = err.error?.message || 'Erro ao atualizar o status de novos usuários.';
        this.dashboardComponent.showModal('Erro', message);
      }
    });
  }
    
  
  toggleInactiveUserStatus(promotion: any, event: Event): void {
    event.preventDefault();

    promotion.discount = parseInt(promotion.discount.replace('%', ''), 10); 
    promotion.for_inactive_users = promotion.for_inactive_users === 1 ? 0 : 1;

    if (promotion.for_new_users === 0 && promotion.for_inactive_users === 0) {
      promotion.generic = 1;
    }
    
    this.promotionsService.update(promotion.id, promotion).subscribe({
      next: (res: any) => {
        const index = this.promotions.findIndex(p => p.id === promotion.id);
        if (index !== -1) {
          setTimeout(() => {
            this.promotions[index] = res.promotion;
            this.loadQuickPromotions();
          }, 200)
        }
      },
      error: (err: any) => {
        console.log(err);
        const message = err.error?.message || 'Erro ao atualizar o status de usuários inativos.';
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
