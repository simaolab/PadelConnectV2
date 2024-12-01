import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DropdownComponent } from '../../utilities/dropdown/dropdown.component';

import { UsersService } from '../../../../services/users.service';
import { NationalitiesService } from '../../../../services/nationalities.service';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TitlePageComponent,
    DashboardComponent,
    DropdownComponent
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
    nationality_id: '',
    birthday: '',
    address: '',
    newsletter: 0,
  };

  addressObj = {
    addressPort: '',
    postalCode: '',
    locality: '',
  }

  client_id: number = 0;

  nationalities: any[] = [];

  constructor(
    private router: Router,
    private usersService: UsersService,
    private nationalitiesService: NationalitiesService,
    private dashboardComponent: DashboardComponent
  ) {}

  formErrors: { [key: string]: string } = {};

  ngOnInit(): void {
    this.userInfo();
    this.loadNationalities();
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
            nationality_id: client.nationality?.name,
            birthday: client.user?.birthday,
            address: client.address || ' ',
            newsletter: client.newsletter,
          };

          if (client.address) {
            const addressParts = client.address.split(', ');

            if (addressParts.length === 3) {
              this.addressObj = {
                addressPort: addressParts[0],
                postalCode: addressParts[1],
                locality: addressParts[2],
              };
            }
          }
        }
      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal(
          'Error',
          message
        )
      }
    });
  }

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  editClient(): void {
    this.clientObj.address = this.address;

    this.usersService.editClient(this.clientObj, this.client_id).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Message',
            res.message,
          )
        }
      },
      error: (err: any) => {
        this.formErrors = {};
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
      },
      error: (err: any) => {
        const message = err.error?.message;

        this.dashboardComponent.showModal(
          'Error',
          message
        )
      }
    })
  }

  loadNationalities(): void {
    this.nationalitiesService.index().subscribe({
      next: (data: any[]) => {
        this.nationalities = data
      },
      error: (err: any) => {
        const message = err.error?.message;
        this.dashboardComponent.showModal(
          'Error',
          message
        );
      }
    });
  }


  onNationalitySelected(nationality: any): void {
    this.clientObj.nationality_id = nationality.id;
  }


  toggleNewsletter(event: Event): void {
    this.clientObj.newsletter = (event.target as HTMLInputElement).checked ? 1 : 0;
  }

}
