import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompaniesService } from '../../../../../services/companies.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardFormComponent,
    TitlePageComponent,
    DashboardComponent
  ],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.css'
})
export class EditCompanyComponent {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companiesService: CompaniesService,
    private dashboardComponent: DashboardComponent
  ) {}

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

  company_id: number = 0;

  get address(): string {
    return `${this.addressObj.addressPort}, ${this.addressObj.postalCode}, ${this.addressObj.locality}`;
  }

  ngOnInit(): void {
    this.company_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCompany();
  }

  loadCompany(): void {

      this.companiesService.show(this.company_id).subscribe({
        next: (res: any) => {
          const company = res.company;

          this.companyObj = {
            name: company.name,
            email: company.email,
            contact: company.contact,
            nif: company.nif,
            newsletter: company.newsletter,
            address: company.address
          };

          const addressParts = company.address.split(', ');

          if (addressParts.length === 3) {
            this.addressObj = {
              addressPort: addressParts[0],
              postalCode: addressParts[1],
              locality: addressParts[2],
            };
          }
        },
        error: (err) => {
          const errorMessage = err?.error?.message;

          this.dashboardComponent.showModal(
            'Error',
            errorMessage,
            () => {
              this.router.navigate(['/dashboard/companies']);
            }
          );
        }
      });
  }

  editCompany(): void {
    this.companyObj.address = this.address;

    this.companiesService.edit(this.companyObj, this.company_id).subscribe({
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
