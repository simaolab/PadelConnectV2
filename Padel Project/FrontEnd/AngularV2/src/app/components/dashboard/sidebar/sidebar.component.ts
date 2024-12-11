import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { UsersService } from '../../../services/users.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LinksSidebarComponent } from '../utilities/links-sidebar/links-sidebar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    LinksSidebarComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() isSidebarClosed: boolean = false;

  isAdmin: boolean = false;
  userRole: number = 0;

  sidebarLinks = [
    { href: '/dashboard/reservations', icon: 'ri-list-check-2', label: 'Reservas', adminOnly: false, allowedRoles: [1, 2, 3] },
    { href: '/dashboard/companies', icon: 'ri-hotel-line', label: 'Empresas', adminOnly: true, allowedRoles: [1] },
    { href: '/dashboard/courts', icon: 'ri-input-field', label: 'Campos', adminOnly: true, allowedRoles: [1, 2] },
    { href: '/dashboard/customers', icon: 'ri-group-line', label: 'Clientes', adminOnly: true, allowedRoles: [1] },
    { href: '/dashboard/promotions', icon: 'ri-percent-line', label: 'Promoções', adminOnly: false, allowedRoles: [1, 2, 3] },
    { href: '/dashboard/settings', icon: 'ri-user-settings-line', label: 'Definições', adminOnly: false,  allowedRoles: [1, 3] },
  ];

  constructor(
    private dashboardComponent: DashboardComponent,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

  logout(): void {
    this.authService.logout().subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          localStorage.clear();
          this.dashboardComponent.showModal('Sucesso', res.message);

          if (this.dashboardComponent.modalComponent) {
            const subscription = this.dashboardComponent.modalComponent.modalClosed.subscribe(() => {
              this.router.navigate(['']);
              subscription.unsubscribe();
            });
          }
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message;
        this.dashboardComponent.showModal('Erro', errorMessage);
      },
    });
  }
}
