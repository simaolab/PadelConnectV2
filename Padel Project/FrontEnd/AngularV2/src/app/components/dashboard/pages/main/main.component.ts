import { UsersService } from './../../../../services/users.service';
import { PromotionsService } from './../../../../services/promotions.service';
import { CourtsService } from './../../../../services/courts.service';
import { ReservationsService } from './../../../../services/reservations.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(
    private reservationsService: ReservationsService,
    private courtsService: CourtsService,
    private promotionsService: PromotionsService,
    private usersService: UsersService
  ) {}

  reservations: any[] = [];
  courts: any[] = [];
  promotions: any[] = [];
  users: any[] = [];

  totalReservations: number = 0;
  totalCourts: number = 0;
  totalPromotions: number = 0;
  totalUsers: number = 0;

  isAdmin: boolean = false;
  userRole: number = 0;

  totalCourtsCount: number = 0;
  totalIndoorCourtsCount: number  = 0;
  totalOutdoorCourtsCount: number  = 0;

  totalUsersCount: number = 0;
  totalClientsCount: number = 0;
  totalCompanysCount: number = 0;

  totalReservationsCount: number = 0;
  totalAtivesReservationsCount: number = 0;
  totalCancellationsCount: number = 0;

  ngOnInit(): void {
    this.loadReservations();
    this.loadCourts();
    this.loadPromotions();
    this.loadUsers();
    this.userInfo();
  }

  userInfo(): void {
    this.usersService.userInfo().subscribe({
      next: (data: any) => {
        this.isAdmin = data.isAdmin || false;
        this.userRole = data.user.role.id;
      },
      error: () => {
        this.isAdmin = false;
      },
    });
  }

  getProgressPercentage(value: number, total: number): number {
    if (total === 0) {
      return 0;
    }
    return Math.round((value / total) * 100);
  }

  loadReservations(): void {
    this.reservationsService.index().subscribe({
      next: (data: any) => {
          this.reservations = data.reservations;
          this.totalReservations = this.reservations.length;

          this.countReservations();
      },
      error: (err: any) => {
        const message = err.error?.message;
      },
    });
  }

  loadCourts(): void {
    this.courtsService.indexRestricted().subscribe({
      next: (data: any) => {
        this.courts = data.fields;
        this.totalCourts = this.courts.length;

        this.countFields();
      },
      error: (err: any) => {
        const message = err.error?.message;
      }
    });
  }

  countFields(): void {
    this.totalCourtsCount = 0;
    this.totalIndoorCourtsCount = 0;
    this.totalOutdoorCourtsCount = 0;

    this.courts.forEach(court => {
      this.totalCourtsCount++;
      if (court.cover === 0) {
        this.totalIndoorCourtsCount++;
      }
      if (court.cover === 1) {
        this.totalOutdoorCourtsCount++;
      }
    });
  }

  loadPromotions(): void {
    this.promotionsService.index().subscribe({
      next: (data: any) => {
          this.promotions = data.promotions || [];
          this.totalPromotions = this.promotions.length;
      },
      error: (err: any) => {
        const message = err.error?.message;
      }
    });
  }

  loadUsers(): void {
    this.usersService.index().subscribe({
      next: (data: any) => {
          this.users = data;
          this.totalUsers = this.users.length;
          this.countUsers();
      },
      error: (err: any) => {
        const message = err.error?.message;
      }
    });
  }

  countUsers(): void {
    this.totalUsersCount = this.users.length;

    this.totalClientsCount = this.users.filter(user => user.role.id === 3).length;

    this.totalCompanysCount = this.users.filter(user => user.role.id === 2).length;

    const totalAdmins = this.users.filter(user => user.role.id === 1).length;
    this.totalUsersCount = this.totalUsersCount - totalAdmins;
  }

  countReservations(): void {
    this.totalReservationsCount = this.reservations.length;

    this.totalAtivesReservationsCount = this.reservations.filter(reservation => reservation.status === "pendente").length;

    this.totalCancellationsCount = this.reservations.filter(reservation => reservation.status === "Cancelada").length;

    console.log(this.totalAtivesReservationsCount)
    console.log(this.totalCancellationsCount)

  }
}
