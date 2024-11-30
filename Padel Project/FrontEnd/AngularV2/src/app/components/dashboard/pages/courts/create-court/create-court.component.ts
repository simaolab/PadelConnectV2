import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourtsService } from '../../../../../services/courts.service';
import { FormsModule } from '@angular/forms';
import { CompaniesService } from '../../../../../services/companies.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { DropdownComponent } from '../../../utilities/dropdown/dropdown.component';

@Component({
  selector: 'app-create-court',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardFormComponent,
    DashboardComponent,
    DropdownComponent,
  ],
  templateUrl: './create-court.component.html',
  styleUrl: './create-court.component.css'
})

export class CreateCourtComponent {
  formErrors: { [key: string]: string } = {};

  courtObj = {
    name: '',
    company_id: 2,
    price_hour: 5,
    type_floor: '',
    status: '',
    illumination: 0,
    cover: 0,
    last_maintenance: ''
  }

  companies: any[] = [];

    constructor(
      private router: Router,
      private courtsService: CourtsService,
      private dashboardComponent: DashboardComponent,
      private companiesService: CompaniesService
    ) {}

    create() {

      if (this.courtObj.last_maintenance) {
        const dateParts = this.courtObj.last_maintenance.split('-');
        if (dateParts.length === 3) {
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          this.courtObj.last_maintenance = formattedDate;
        }
      }

      this.courtsService.create(this.courtObj).subscribe({
        next: (res: any) => {
          if(res.status === 'success') {
            this.dashboardComponent.showModal(
              'Success',
              res.message,
              () => {
                this.router.navigate(['/dashboard/courts']);
              }
            );
            this.formErrors = {};
          }
        },
        error: (err: any) => {
          this.formErrors = {};
          const errorDetails = err.error?.['error(s)'] || {};

          for (const court in errorDetails) {
            if (errorDetails.hasOwnProperty(court)) {
              this.formErrors[court] = errorDetails[court][0];
            }
          }
        }
      })
    }

    ngOnInit(): void {
      this.loadCompanies();
    }

    loadCompanies(): void {
      this.companiesService.index().subscribe({
        next: (data: any) => {
          this.companies = data.companies;
        },
        error: (err: any) => {
          console.error('Erro ao carregar empresas:', err);
        }
      });
    }

    onCompanySelected(company: any): void {
      // Atualiza o campo company_id com o ID da empresa selecionada
      this.courtObj.company_id = company.id;
    }

}
