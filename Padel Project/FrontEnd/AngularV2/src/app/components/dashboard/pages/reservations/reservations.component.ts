import { ReservationsService } from './../../../../services/reservations.service';
import { Router, RouterModule } from '@angular/router';
import { DashboardComponent } from './../../dashboard/dashboard.component';
import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'reservations',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    RouterModule
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
        setTimeout(() => {
          this.reservations = data.reservations;
          this.isLoading = false;
          console.log(this.reservations)
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

  deleteReservation(reservation_id: number): void {
    this.reservationsService.delete(reservation_id).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.reservations = this.reservations.filter(reservation => reservation.id !== reservation_id);
          this.dashboardComponent.showModal(
            'Sucesso',
            res.message
          )
        }
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
