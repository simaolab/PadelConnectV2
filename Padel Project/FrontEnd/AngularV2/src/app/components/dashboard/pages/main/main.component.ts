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

  loadReservations(): void {
    this.reservationsService.index().subscribe({
      next: (data: any) => {
          this.reservations = data.reservations;
          this.totalReservations = this.reservations.length;
          console.log("reservaas: ", this.reservations)
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
        console.log("campos: ", this.courts)
        this.totalCourts = this.courts.length;
      },
      error: (err: any) => {
        const message = err.error?.message;
      }
    });
  }

  loadPromotions(): void {
    this.promotionsService.index().subscribe({
      next: (data: any) => {
          this.promotions = data.promotions || [];
          this.totalPromotions = this.promotions.length;
          console.log("promoções: ", this.promotions)
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
          console.log("users: ", this.users)
      },
      error: (err: any) => {
        const message = err.error?.message;
      }
    });
  }
}
