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
    private dashboardComponent: DashboardComponent
  ) {}

  reservations: any[] = [];
  isLoading = true;
  showModal: boolean = false;
  selectedReservation: any = null;
  cancelReason: string = '';

  ngOnInit(): void {
    this.loadReservations();
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

  // Abre o modal para confirmar cancelamento
  openModal(reservation: any): void {
    this.selectedReservation = reservation;
    this.cancelReason = ''; // Limpa o motivo do cancelamento
    this.showModal = true;
  }

  // Fecha o modal
  closeModal(): void {
    this.showModal = false;
    this.selectedReservation = null;
    this.cancelReason = '';
  }

  // Função original ajustada para enviar a razão do cancelamento
  deleteReservation(reservation_id: number, reason: string | null = null): void {
    this.reservationsService.delete(reservation_id, reason).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          this.reservations = this.reservations.filter(
            (reservation) => reservation.id !== reservation_id
          );
          this.dashboardComponent.showModal('Sucesso', res.message);
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

  // Submete o cancelamento (chama o método original com reason)
  submitCancel(): void {
    if (this.selectedReservation) {
      this.deleteReservation(this.selectedReservation.id, this.cancelReason || null);
    }
  }
}
