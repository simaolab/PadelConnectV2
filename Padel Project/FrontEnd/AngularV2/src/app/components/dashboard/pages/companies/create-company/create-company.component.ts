import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../../../../services/companies.service';
import { FormsModule } from '@angular/forms';

import { CardTableComponent } from '../../../utilities/card-table/card-table.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { error } from 'console';

@Component({
  selector: 'create-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardTableComponent,
    DashboardComponent
  ],
  templateUrl: './create-company.component.html',
  styleUrl: './create-company.component.css'
})
export class CreateCompanyComponent {

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
        }
      },
      error: (err: any) => {
        const errorMessage = err.error?.message;
        this.dashboardComponent.showModal(
          'Error',
          errorMessage
        );
      }
    })
  }

}
