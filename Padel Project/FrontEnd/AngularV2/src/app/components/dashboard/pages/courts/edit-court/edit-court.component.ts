import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourtsService } from '../../../../../services/courts.service';
import { CompaniesService } from '../../../../../services/companies.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { DropdownComponent } from '../../../utilities/dropdown/dropdown.component';
import { Court } from '../../../../../interfaces/court';

@Component({
  selector: 'app-edit-court',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardFormComponent,
    TitlePageComponent,
    DashboardComponent,
    DropdownComponent
  ],
  templateUrl: './edit-court.component.html',
  styleUrl: './edit-court.component.css'
})
export class EditCourtComponent {

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
    schedules: {
      weekdays: { opening_time: '', closing_time: '', is_closed: 0 },
      saturday: { opening_time: '', closing_time: '', is_closed: 1 }, 
      sunday: { opening_time: '', closing_time: '', is_closed: 1 },
    }
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

  court_id: number = 0;

  defaultImagePath: string = 'assets/images/default-image.jpg';
  currentImagePath: string = this.defaultImagePath;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService,
    private dashboardComponent: DashboardComponent,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCompanies();
    this.loadCourt();
  }

  loadCourt(): void {
    this.courtsService.show(this.court_id).subscribe({
      next: (court: any) => {        
        const field = court.field;
        const formattedDate = this.convertToDateFormat(field.last_maintenance);

        const weekdays = this.formatTimeFields(court.schedules?.weekdays?.[0] || {});
        const saturday = this.formatTimeFields(court.schedules?.saturday || {});
        const sunday = this.formatTimeFields(court.schedules?.sunday || {});

        console.log('court:', court);
        this.courtObj = {
          name: field.name,
          company_id: field.company.id,
          price_hour: field.price_hour,
          type_floor: field.type_floor,
          status: field.status,
          illumination: field.illumination,
          cover: field.cover,
          last_maintenance: formattedDate,
          shower_room: field.shower_room,
          lockers: field.lockers,
          rent_equipment: field.rent_equipment,
          file_path: field.file_path,
          schedules: {
            weekdays: weekdays,
            saturday: saturday,
            sunday: sunday,
          },
        };
        
        this.currentImagePath = field.file_path || this.defaultImagePath;
      },
      error: (err) => {
        const errorMessage = err?.error?.message

        this.dashboardComponent.showModal(
          'Erro',
          errorMessage,
          () => {
            this.router.navigate(['/dashboard/courts']);
          }
        );
      }
    });
  }

  formatTimeFields(schedule: any): any {
    if (!schedule) return schedule;
  
    const formatTime = (time: string | null): string => {
      if (!time) return '';
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    };
  
    return {
      opening_time: formatTime(schedule.opening_time),
      closing_time: formatTime(schedule.closing_time),
      is_closed: schedule.is_closed ?? 0,
    };
  }

  convertToDateFormat(date: string): string {
    if (!date) return '';

    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  editCourt(): void {
    console.log('Court', this.courtObj);
    this.courtsService.edit(this.courtObj, this.court_id).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Mensagem',
            res.message,
            () => {
              this.router.navigate(['/dashboard/courts']);
            }
          );
          this.formErrors = {}
        }
      },
      error: (err: any) => {
        this.formErrors = {};
        const errorDetails = err.error?.['error(s)'] || {};

        console.log('errorDetails:', errorDetails);

        for (const company in errorDetails) {
          if (errorDetails.hasOwnProperty(company)) {
            this.formErrors[company] = errorDetails[company][0];
          }
        }
      }
    })
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

  toggleSaturday(): void {
    this.courtObj.schedules.saturday.is_closed = this.courtObj.schedules.saturday.is_closed === 0 ? 1 : 0;
    if (this.courtObj.schedules.saturday.is_closed === 0) {
      this.courtObj.schedules.saturday.opening_time = '';
      this.courtObj.schedules.saturday.closing_time = '';
    }
  }
  
  toggleSunday(): void {
    this.courtObj.schedules.sunday.is_closed = this.courtObj.schedules.sunday.is_closed === 0 ? 1 : 0;
    if (this.courtObj.schedules.sunday.is_closed === 0) {
      this.courtObj.schedules.sunday.opening_time = '';
      this.courtObj.schedules.sunday.closing_time = '';
    }
  }

  toggleService(serviceKey: keyof typeof this.serviceStates): void {
    this.serviceStates[serviceKey] = !this.serviceStates[serviceKey];
    this.courtObj[serviceKey] = this.serviceStates[serviceKey] ? 1 : 0;

    this.serviceTexts[serviceKey] = this.serviceStates[serviceKey]
      ? `Com ${this.getServiceName(serviceKey)}`
      : `Sem ${this.getServiceName(serviceKey)}`;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.currentImagePath = URL.createObjectURL(file);
      this.courtObj.file_path = file; 
    } else {
      this.currentImagePath = this.defaultImagePath;
      this.courtObj.file_path = null;
    }
  }
}
