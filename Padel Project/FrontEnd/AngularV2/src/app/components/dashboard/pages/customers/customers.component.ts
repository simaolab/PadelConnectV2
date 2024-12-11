import { Component } from '@angular/core';
import { ModalComponent } from '../../../utilities/modal/modal.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from './../../../../services/users.service';
import { Subscription } from 'rxjs';

import { CardTableComponent } from '../../utilities/card-table/card-table.component';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'customers',
  standalone: true,
  imports: [
    RouterModule,
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
  searchSubscription: Subscription | null = null;

  src: string = '../../../../../assets/images/icons/unauthorized.png'

  constructor(
    private usersService: UsersService,
    private router: Router,
    private dashboardComponent: DashboardComponent,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.index().subscribe({
      next: (data: any) => {
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
              'Erro',
              'Erro ao tentar carregar a lista de usuários'
            );
          }
        }
      }
    });
  }

  showUser(user_id: number) {
    this.usersService.show(user_id).subscribe({
      next: (data: any) => {
      },
      error: (err: any) => {
        console.error('Erro ao carregar os detalhes do usuário:', err);
        alert('Erro ao carregar detalhes do usuário: ' + err.message);
      }
    })
  }

  searchUsers(name: string): void {
    if (name.trim() === '') {
      this.loadUsers(); // Chama a função de carregar todos os usuários se o nameo estiver vazio
    } else {
      this.isLoading = true; // Define como verdadeiro enquanto busca
      this.usersService.search(name).subscribe({
        next: (data: any) => {
          this.users = data; // Atualiza a lista de usuários com os resultados da busca
          this.isLoading = false; // Define como falso quando a busca nameina
        },
        error: (err: any) => {
          const message = err.error?.message || 'Erro ao realizar a busca';
          alert(message); // Exibe o erro
          this.isLoading = false; // Define como falso em caso de erro
        }
      });
    }
  }
}
