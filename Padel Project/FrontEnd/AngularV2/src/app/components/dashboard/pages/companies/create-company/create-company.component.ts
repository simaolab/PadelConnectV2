import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../../../../services/companies.service';
import { FormsModule } from '@angular/forms';

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

  companyObj = {
    name: '',
    email: '',
    contact: 0,
    nif: 0,
    newsletter: 0,
    address: '',
  }

  addressObj = {
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
    this.companyObj.address = this.address;

    this.companiesService.create(this.companyObj).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Message',
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
}
