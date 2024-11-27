import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    address_id: 0,
    name: '',
    email: '',
    contact: 0,
    nif: 0,
    newsletter: 0
  }

  constructor(
    private router: Router,
    private companiesService: CompaniesService,
    private dashboardComponent: DashboardComponent,
  ) {}

  create() {
    this.companiesService.create(this.companyObj).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Message',
            res.message
          );
          this.formErrors = {};
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        console.log(errorDetails)

        for (const company in errorDetails) {
          if (errorDetails.hasOwnProperty(company)) {
            this.formErrors[company] = errorDetails[company][0];
          }
        }
      }
    })
  }

}
