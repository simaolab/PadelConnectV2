import { resolve } from 'node:path';
import { DashboardComponent } from './../../dashboard/dashboard.component';
import { PromotionsService } from './../../../../services/promotions.service';
import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'reservations',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {
  constructor(
    private promotionsService: PromotionsService,
    private dashboardComponent: DashboardComponent
  ) {}

  reservations: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.promotionsService.index().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.reservations = data.reservations || [];
          this.isLoading = false;
        }, 1500)

      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal(
          'Error',
          message
        )
      }
    });
  }
}
