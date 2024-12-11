import { UsersService } from './../../../../services/users.service';
import { ReservationsService } from './../../../../services/reservations.service';
import { Router, RouterModule } from '@angular/router';
import { DashboardComponent } from './../../dashboard/dashboard.component';
import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'reservations',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitlePageComponent,
    RouterModule,
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent {
  constructor(
    private reservationsService: ReservationsService,
    private dashboardComponent: DashboardComponent,
    private usersService: UsersService
  ) {}

  reservations: any[] = [];
  isLoading = true;
  showModal: boolean = false;
  selectedReservation: any = null;
  reason: string = '';
  isAdmin: boolean = false;

  ngOnInit(): void {
    this.loadReservations();
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

  loadReservations(): void {
    this.reservationsService.index().subscribe({
      next: (data: any) => {
        setTimeout(() => {
          this.reservations = data.reservations;
          this.isLoading = false;
        }, 1500);
      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal('Erro', message);
      },
    });
  }

  openModal(reservation: any): void {
    this.selectedReservation = reservation;
    this.reason = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = null;
    this.reason = '';
  }

  deleteReservation(reservation_id: number, reason: string | null = null): void {
    if (!reason) {
      reason = null;
    }

    this.reservationsService.delete(reservation_id, reason).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.reservations = this.reservations.filter(
            (reservation) => reservation.id !== reservation_id
          );
          this.dashboardComponent.showModal('Sucesso', res.message);
          console.log(reason)
          this.closeModal(); // Fecha o modal
        }
      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal('Erro', message);
        this.closeModal();
      },
    });
  }

  submitCancel(): void {
    if (this.selectedReservation) {
      this.deleteReservation(this.selectedReservation.id, this.reason || null);
    }
  }
}
