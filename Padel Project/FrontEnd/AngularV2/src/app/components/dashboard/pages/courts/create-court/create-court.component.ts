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
import { Court } from '../../../../../models/court';

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

  courtObj: Court = {
    name: '',
    company_id: 0,
    price_hour: 0,
    type_floor: '',
    status: '',
    illumination: 0,
    cover: 0,
    last_maintenance: '',
    shower_room: 0,
    lockers: 0,
    rent_equipment: 0,
  }

  serviceStates = {
    illumination: false,
    cover: false,
    shower_room: false,
    lockers: false,
    rent_equipment: false,
  };

  serviceTexts = {
    illumination: 'Sem Iluminação',
    cover: 'Exterior',
    shower_room: 'Sem Balneário',
    lockers: 'Sem Cacifo',
    rent_equipment: 'Sem Aluguer Equipamento',
  };

  statusOptions = [
    { label: 'Disponível', value: 'Disponivel' },
    { label: 'Indisponível', value: 'Indisponivel' },
    { label: 'Inativo', value: 'Inativo' },
  ];

  floorOptions = [
    { label: 'Piso Cimento', value: 'Piso Cimento' },
    { label: 'Piso Madeira', value: 'Piso Madeira' },
    { label: 'Piso Acrílico', value: 'Piso Acrílico' },
    { label: 'Piso Relva Sintética', value: 'Piso Relva Sintética' },
  ];

  companies: any[] = [];

    constructor(
      private router: Router,
      private courtsService: CourtsService,
      private dashboardComponent: DashboardComponent,
      private companiesService: CompaniesService
    ) {}

    ngOnInit(): void {
      this.loadCompanies();
    }

    create() {

      // this.formatLastMaintenanceDate();

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

          console.error(err.error)

          for (const court in errorDetails) {
            if (errorDetails.hasOwnProperty(court)) {
              this.formErrors[court] = errorDetails[court][0];
            }
          }
        }
      })
    }

    // private formatLastMaintenanceDate(): void {
    //   if (this.courtObj.last_maintenance) {
    //     const dateParts = this.courtObj.last_maintenance.split('-');
    //     if (dateParts.length === 3) {
    //       this.courtObj.last_maintenance = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    //     }
    //   }
    // }

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
      this.courtObj.company_id = company.id;
    }

    onStatusSelected(selected: any): void {
      this.courtObj.status = selected.value;
    }

    onTypeFloorSelected(selected: any): void {
      this.courtObj.type_floor = selected.value;
    }

    toggleService(serviceKey: keyof typeof this.serviceStates): void {
      this.serviceStates[serviceKey] = !this.serviceStates[serviceKey];
      this.courtObj[serviceKey] = this.serviceStates[serviceKey] ? 1 : 0;

      this.serviceTexts[serviceKey] = this.serviceStates[serviceKey]
        ? `Com ${this.getServiceName(serviceKey)}`
        : `Sem ${this.getServiceName(serviceKey)}`;
    }

    private getServiceName(serviceKey: string): string {
      const names: { [key: string]: string } = {
        illumination: 'Iluminação',
        cover: 'Cobertura',
        shower_room: 'Balneário',
        lockers: 'Cacifo',
        rent_equipment: 'Aluguer Equipamento',
      };
      return names[serviceKey] || serviceKey;
    }
}
