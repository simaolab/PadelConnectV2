import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TitlePageComponent,
    DashboardComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  clientObj = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    nif: 0,
    contact: 0,
    gender: '',
    nationality: '',
    birthday: '',
    address: '',
    newsletter: 'Não',
  };

  addressObj = {
    addressPort: 'Ainda não tem morada',
    postalCode: 'Não definido',
    locality: 'Ainda não tem localidade',
  }

  client_id: number = 0;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private dashboardComponent: DashboardComponent
  ) {}

  formErrors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.userInfo();
  }

  clientInfo(client_id: number): void {
    this.usersService.clientInfo(client_id).subscribe({
      next: (res: any) => {
        if (res && res.client) {
          const client = res.client;

          this.clientObj = {
            first_name: client.first_name,
            last_name: client.last_name,
            username: client.user?.username,
            email: client.user?.email,
            nif: client.user?.nif,
            contact: client.contact,
            gender: client.gender,
            nationality: client.nationality?.name,
            birthday: client.user?.birthday,
            address: client.address,
            newsletter: client.newsletter,
          };

          const addressParts = client.address.split(', ');

          if (addressParts.length === 3) {
            this.addressObj = {
              addressPort: addressParts[0],
              postalCode: addressParts[1],
              locality: addressParts[2],
            };
          }

        } else {
          console.error('A resposta não contém o objeto "client".', res);
        }
      },
      error: (err: any) => {
        console.error('Erro ao obter informações do cliente:', err);
      }
    });
  }

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  editClient(): void {
    this.clientObj.address = this.address;

    console.log(this.clientObj)

    this.usersService.editClient(this.clientObj, this.client_id).subscribe({
      next: (res: any) => {
        console.log(res)
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Message',
            res.message,
          )
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        console.log('Detalhes do erro:', err.error);
        const errorDetails = err.error?.['error(s)'] || {};

        for (const company in errorDetails) {
          if (errorDetails.hasOwnProperty(company)) {
            this.formErrors[company] = errorDetails[company][0];
          }
        }
      }
    })
  }

  userInfo(): void {
    this.usersService.userInfo().subscribe({
      next: (res: any) => {
        this.client_id = res.user.id
        this.clientInfo(this.client_id);
      }
    })
  }
}
