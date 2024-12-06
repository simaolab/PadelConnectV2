import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../../../../services/companies.service';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../../../interfaces/address';
import { Company } from '../../../../../interfaces/company';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'create-company',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
    DashboardComponent
  ],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent {

  formErrors: { [key: string]: string } = {};

  companyObj: Company = {
    user_name: '',
    user_email: '',
    contact: 0,
    user_nif: 0,
    newsletter: 0,
    address: '',
    name: '',
  }

  passwordObj = {
    user_password: '',
    user_password_confirmation: '',
  };

  passwordStrengthProgress = 0;
  passwordStrengthLevel: string = '';
  passwordStrengthMessage: string = '';
  passwordStrengthStatus = {
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    symbol: false,
  };

  addressObj: Address = {
    addressPort: '',
    postalCode: '',
    locality: '',
  }

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  constructor(
    private router: Router,
    private companiesService: CompaniesService,
    private dashboardComponent: DashboardComponent,
  ) {}

  create() {

    this.formErrors = {};

    const regexAddressPort = /^[a-zA-ZÀ-ÿ0-9.,\-/\s]+$/;
    const localityRegex = /^[a-zA-ZÀ-ÿ\s\-]+$/;
    const postalCodeRegex = /^\d{4}-\d{3}$/;

    if (!this.addressObj['addressPort'] || !this.addressObj['postalCode'] || !this.addressObj['locality']) {
      if (!this.addressObj['addressPort']) {
        this.formErrors['addressPort'] = 'Endereço e número da porta são obrigatórios.';
      } else { this.formErrors['addressPort'] = ''; }

      if (!this.addressObj['postalCode']) {
        this.formErrors['postalCode'] = 'O código postal é obrigatório.';
      } else { this.formErrors['postalCode'] = ''; }

      if (!this.addressObj['locality']) {
        this.formErrors['locality'] = 'A localidade é obrigatória.';
      } else { this.formErrors['locality'] = ''; }
      return;
    }

    if (!regexAddressPort.test(this.addressObj.addressPort)
      || !localityRegex.test(this.addressObj.locality)
      || !postalCodeRegex.test(this.addressObj.postalCode))
    {
      if (!regexAddressPort.test(this.addressObj.addressPort)) {
        this.formErrors['addressPort'] = 'A morada não pode conter caractéres especiais.';
      } else { this.formErrors['addressPort'] = ''; }
      if (!localityRegex.test(this.addressObj.locality)) {
        this.formErrors['locality'] = 'A localidade não pode conter caractéres especiais.';
      } else { this.formErrors['locality'] = ''; }
      if (!postalCodeRegex.test(this.addressObj.postalCode)) {
        this.formErrors['postalCode'] = 'O código postal deve estar no formato 1234-567.';
      } else { this.formErrors['postalCode'] = ''; }
      return;
    }

    this.companyObj.address = this.address;

    this.companiesService.create({
      ...this.companyObj,
      user_password: this.passwordObj.user_password,
      user_password_confirmation: this.passwordObj.user_password_confirmation,
    }as any).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Mensagem',
            res.message,
            () => {
              this.router.navigate(['/dashboard/companies']);
            }
          );
          this.formErrors = {};
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        for (const field in errorDetails) {
          if (errorDetails.hasOwnProperty(field)) {
              // Redireciona o erro "user_password.confirmed" para "user_password_confirmation"
              if (field === 'user_password' && errorDetails[field][0].includes('não corresponde')) {
                  this.formErrors['user_password_confirmation'] = errorDetails[field][0];
              } else {
                  this.formErrors[field] = errorDetails[field][0];
              }
          }
      }
      }
    })
  }

  toggleNewsletter(event: Event): void {
    this.companyObj.newsletter = (event.target as HTMLInputElement).checked ? 1 : 0;
  }

  formatPostalCode(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    value = value.replace(/[^0-9]/g, '');

    if (value.length > 4) {
      value = `${value.slice(0, 4)}-${value.slice(4, 7)}`;
    }

    input.value = value;
    this.addressObj.postalCode = value;
  }

  formatContact(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    input.value = value;
    this.companyObj.contact = value ? parseInt(value, 10) : null;
  }

  formatNif(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    value = value.replace(/[^0-9]/g, '');
    input.value = value;
    this.companyObj.user_nif = value ? parseInt(value, 10) : 0;
  }

  evaluatePasswordStrength(password: string): void {
    
    this.formErrors = {};
    let strength = 0;

    this.passwordStrengthStatus.length = password.length >= 8;
    this.passwordStrengthStatus.lowercase = /[a-z]/.test(password);
    this.passwordStrengthStatus.uppercase = /[A-Z]/.test(password);
    this.passwordStrengthStatus.number = /\d/.test(password);
    this.passwordStrengthStatus.symbol = /[\W_]/.test(password);

    strength += this.passwordStrengthStatus.length ? 20 : 0;
    strength += this.passwordStrengthStatus.lowercase ? 20 : 0;
    strength += this.passwordStrengthStatus.uppercase ? 20 : 0;
    strength += this.passwordStrengthStatus.number ? 20 : 0;
    strength += this.passwordStrengthStatus.symbol ? 20 : 0;

    this.passwordStrengthProgress = strength;

    if (strength === 0) {
      this.passwordStrengthLevel = 'none';
      this.passwordStrengthMessage = '';
    } else if (strength <= 20) {
      this.passwordStrengthLevel = 'very-weak';
      this.passwordStrengthMessage = 'Estado password: Péssima';
    } else if (strength <= 40) {
      this.passwordStrengthLevel = 'weak';
      this.passwordStrengthMessage = 'Estado password: Fraca';
    } else if (strength <= 60) {
      this.passwordStrengthLevel = 'medium';
      this.passwordStrengthMessage = 'Estado password: Média';
    } else if (strength <= 80) {
      this.passwordStrengthLevel = 'good';
      this.passwordStrengthMessage = 'Estado password: Boa';
    } else {
      this.passwordStrengthLevel = 'perfect';
      this.passwordStrengthMessage = 'Estado password: Excelente';
    }
  }
}
