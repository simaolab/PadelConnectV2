import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DropdownComponent } from '../../utilities/dropdown/dropdown.component';

import { UsersService } from '../../../../services/users.service';
import { NationalitiesService } from '../../../../services/nationalities.service';
import { log } from 'node:console';

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

  passwordObj = {
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  };

  addressObj = {
    addressPort: '',
    postalCode: '',
    locality: '',
  }

  genderOptions = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Outro', value: 'Outro' },
  ];

  passwordStrengthStatus = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    symbol: false,
  };

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
            gender: client.gender || '',
            nationality_id: client.nationality?.id || '',
            birthday: client.user?.birthday,
            address: client.address || ' ',
            newsletter: client.newsletter,
          };

          if (client.address) {
            const addressParts = client.address.split(', ');

            if (addressParts.length === 4) {
              this.addressObj = {
                addressPort: addressParts[0] + ', ' + addressParts[1],
                postalCode: addressParts[2],
                locality: addressParts[3],
              };
            } else if (addressParts.length === 3) {
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

  updatePassword(): void {
    
    this.formErrors = {};

    if (this.passwordObj.current_password) {
    
      const passwordData = {
          current_password: this.passwordObj.current_password,
          new_password: this.passwordObj.new_password,
          new_password_confirmation: this.passwordObj.new_password_confirmation,
      };
      
      this.usersService.updatePassword(passwordData).subscribe({
          next: (res: any) => {
              if (res.message) {
                this.editClient(true);
              }
          },
          error: (err: any) => {
            const errorDetails = err.error?.['error(s)'] || {};
        
            for (const field in errorDetails) {
                if (errorDetails.hasOwnProperty(field)) {
                    // Redireciona o erro "new_password.confirmed" para "new_password_confirmation"
                    if (field === 'new_password' && errorDetails[field][0].includes('não corresponde')) {
                        this.formErrors['new_password_confirmation'] = errorDetails[field][0];
                    } else {
                        this.formErrors[field] = errorDetails[field][0];
                    }
                }
            }
        },
      });  
    }
    else {
      this.editClient(false);
    }
  }

  editClient(passwordUpdated: boolean): void {
    this.formErrors = {};

    this.clientObj.address = this.address;

    this.usersService.editClient(this.clientObj, this.client_id).subscribe({
      next: (res: any) => {
        if (res.status === 'success') {
          if (passwordUpdated) {
            this.dashboardComponent.showModal(
              'Mensagem',
              'Dados e senha do cliente atualizados com sucesso!',  // Mensagem comum
              () => window.location.reload()
            );
          } else {
            this.dashboardComponent.showModal(
              'Mensagem',
              'Dados do cliente atualizados com sucesso!',  // Somente dados alterados
              () => window.location.reload()
            );
          }
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        for (const field in errorDetails) {
          if (errorDetails.hasOwnProperty(field)) {
            this.formErrors[field] = errorDetails[field][0];
          }
        }
      },
    });
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
          'Erro',
          message
        )
      }
    })
  }

  loadNationalities(): void {
    this.nationalitiesService.index().subscribe({
      next: (data: any[]) => {
        this.nationalities = data;
        this.userInfo();
      },
      error: (err: any) => {
        const message = err.error?.message;
        this.dashboardComponent.showModal(
          'Erro',
          message
        );
      }
    });
  }

  onGenderSelected(gender: any): void {
    this.clientObj.gender = gender.value;
  }

  onNationalitySelected(nationality: any): void {
    this.clientObj.nationality_id = nationality.id;
  }

  toggleNewsletter(event: Event): void {
    this.clientObj.newsletter = (event.target as HTMLInputElement).checked ? 1 : 0;
  }
  
  evaluatePasswordStrength(password: string): void {
    this.passwordStrengthStatus.length = password.length >= 8;
    this.passwordStrengthStatus.lowercase = /[a-z]/.test(password);
    this.passwordStrengthStatus.uppercase = /[A-Z]/.test(password);
    this.passwordStrengthStatus.number = /\d/.test(password);
    this.passwordStrengthStatus.symbol = /[\W_]/.test(password);
  }
  
}
