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
import { Court } from '../../../../../interfaces/court';

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

  todayDate: string = new Date().toISOString().split('T')[0];
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
    file_path: null,
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
      this.courtsService.create(this.courtObj).subscribe({
        next: (res: any) => {
          if(res.status === 'success') {
            this.dashboardComponent.showModal(
              'Sucesso',
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

    onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.courtObj.file_path = file;
      }
    }

    formatPriceHour(event: Event): void {
      const input = event.target as HTMLInputElement;
      let value = input.value;

      value = value.replace(/[^0-9\.]/g, '');
      if ((value.match(/\./g) || []).length > 1) {
        value = value.replace(/\.$/, '');
      }
      if (value.length > 2 && !value.includes('.')) {
        value = value.slice(0, 2) + '.' + value.slice(2);
      }
      if (value.includes('.')) {
        const [integerPart, decimalPart] = value.split('.');
        value = integerPart + '.' + (decimalPart.length > 2 ? decimalPart.substring(0, 2) : decimalPart);
      }

      input.value = value;
      this.courtObj.price_hour = value ? parseFloat(value) : 0;
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
