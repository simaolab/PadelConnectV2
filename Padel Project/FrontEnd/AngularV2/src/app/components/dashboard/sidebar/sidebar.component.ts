import { AuthService } from './../../../services/auth.service';
import { UsersService } from '../../../services/users.service';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LinksSidebarComponent } from '../utilities/links-sidebar/links-sidebar.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    LinksSidebarComponent,
    DashboardComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{

  isAdmin: boolean = false;

  constructor(
    private dashboardComponent: DashboardComponent,
    private authService: AuthService,
    private usersService: UsersService,
    private router: Router,
  ) { }

  ngOnInit():void {
    this.userInfo();
  }

  userInfo() {
    this.usersService.userInfo().subscribe({
      next: (data: any) => {
        if(data.isAdmin) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        }
    })
  }

  logout() {
    this.authService.logout().subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          localStorage.clear();
          this.dashboardComponent.showModal('Success', res.message);

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
        this.dashboardComponent.showModal(
          'Error',
          errorMessage
        );
      }
    });
  }
}
