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

}
