import { Component } from '@angular/core';
import { ModalComponent } from '../../../utilities/modal/modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from './../../../../services/users.service';

import { CardTableComponent } from '../../utilities/card-table/card-table.component';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'customers',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    ModalComponent,
    CardTableComponent,
    DashboardComponent
],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

  users: any[] = [];
  isLoading = true;

  src: string = '../../../../../assets/images/icons/unauthorized.png'

  constructor(
    private userService: UsersService,
    private router: Router,
    private dashboardComponent: DashboardComponent,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.index().subscribe({
      next: (data: any) => {
        console.log(data)
        setTimeout(() => {
          this.users = data;
          this.isLoading = false;
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading = false;

        if (err.status === 403) {
          this.router.navigate(['error-page'], {
            queryParams: {
              error: '403',
              message: 'Você não tem permissão para aceder a esta página!',
              src: this.src
            }
          }
          );
        } else {
          alert('Erro: ' + err.message);
          if (this.router.url.includes('/courts')) {
            this.dashboardComponent.showModal(
              'Error',
              'Erro ao tentar carregar a lista de usuários'
            );
          }
        }
      }
    });
  }

  showUser(user_id: number) {
    this.userService.show(user_id).subscribe({
      next: (data: any) => {
        console.log(data)

      },
      error: (err: any) => {
        console.error('Erro ao carregar os detalhes do usuário:', err);
        alert('Erro ao carregar detalhes do usuário: ' + err.message);
      }
    })
  }
}
