import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../../../../services/companies.service';
import { FormsModule } from '@angular/forms';
import { Address } from '../../../../../models/address';
import { Company } from '../../../../../models/company';

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
    name: '',
    email: '',
    contact: 0,
    nif: 0,
    newsletter: 0,
    address: '',
  }

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

    this.companiesService.create(this.companyObj).subscribe({
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

        for (const company in errorDetails) {
          if (errorDetails.hasOwnProperty(company)) {
            this.formErrors[company] = errorDetails[company][0];
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
    this.companyObj.nif = value ? parseInt(value, 10) : 0;
  }
}
