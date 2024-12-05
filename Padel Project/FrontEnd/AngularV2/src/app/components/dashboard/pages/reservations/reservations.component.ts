import { ReservationsService } from './../../../../services/reservations.service';
import { resolve } from 'node:path';
import { DashboardComponent } from './../../dashboard/dashboard.component';
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
    private reservationsService: ReservationsService,
    private dashboardComponent: DashboardComponent
  ) {}

  reservations: any[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationsService.index().subscribe({
      next: (data: any) => {
          this.reservations = data.reservations;
          this.isLoading = false;
          console.log('Reservas back:', data)
          console.log('Reservas:', this.reservations)
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
