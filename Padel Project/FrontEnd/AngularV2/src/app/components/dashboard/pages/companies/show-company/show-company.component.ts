import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompaniesService } from '../../../../../services/companies.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { Company } from '../../../../../interfaces/company';
import { Address } from '../../../../../interfaces/address';

@Component({
  selector: 'app-show-company',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
    DashboardComponent,
  ],
  templateUrl: './show-company.component.html',
  styleUrl: './show-company.component.css'
})
export class ShowCompanyComponent {

  companyObj: Company = {
    user_name: '',
    user_email: '',
    contact: 0,
    user_nif: 0,
    newsletter: 0,
    address: '',
    name: ''
  }

  addressObj: Address = {
    addressPort: '',
    postalCode: '',
    locality: '',
  }

  company_id: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companiesService: CompaniesService,
    private dashboardComponent: DashboardComponent
  ) {}


  ngOnInit(): void {
    this.company_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.showCompany();
  }

  showCompany(): void {

      this.companiesService.show(this.company_id).subscribe({
        next: (res: any) => {
          const company = res.company;

          this.companyObj = {
            name: company.name,
            user_email: company.user?.email,
            contact: company.contact,
            user_nif: company.user?.nif,
            user_name: company.user?.username,
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
            'Erro',
            errorMessage,
            () => {
              this.router.navigate(['/dashboard/companies']);
            }
          );
        }
      });
  }

  deleteCompany(event: Event): void {
    event.preventDefault();

    this.companiesService.delete(this.company_id).subscribe({
      next: (res: any) => {
          if(this.router.url.includes('/company')) {
            this.dashboardComponent.showModal(
              'Successo',
              res.message,
              () => {
                this.router.navigate(['/dashboard/companies']);
              }
            )
          }
      },
      error: (err) => {
        const errorMessage = err?.error?.message;

        this.dashboardComponent.showModal(
          'Erro',
          errorMessage,
        );
      }
    })
  }
}
