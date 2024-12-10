import { CourtsService } from './../../../../services/courts.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CardTableComponent } from '../../utilities/card-table/card-table.component';
import { ModalComponent } from '../../../utilities/modal/modal.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AddButtonComponent } from '../../utilities/add-button/add-button.component';

@Component({
  selector: 'courts',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TitlePageComponent,
    CardTableComponent,
    ModalComponent,
    DashboardComponent,
    AddButtonComponent
  ],
  templateUrl: './courts.component.html',
  styleUrls: ['./courts.component.css']
})
export class CourtsComponent {

  courts: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private courtsService: CourtsService,
    private dashboardComponent: DashboardComponent,
  ) {}

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    
    this.courtsService.index().subscribe({
      next: (data: any) => {        
        setTimeout(() => {
          if (data && data.message) {
            if (this.router.url.includes('/courts')) {
              this.dashboardComponent.showModal('Mensagem', data.message);
            }
          } else {
            this.courts = data.fields.map((court: any) => {
              if (court.schedules) {
                const schedules = this.transformSchedules(court.schedules);
                court.schedules = schedules;
                console.log(schedules)
              } else {
                court.schedules = {
                  weekdays: { opening_time: null, closing_time: null, is_closed: false },
                  saturday: { opening_time: null, closing_time: null, is_closed: false },
                  sunday: { opening_time: null, closing_time: null, is_closed: false }
                };
              }
              return court;
            });
          }
          this.isLoading = false;
        }, 1500);
      },
      error: (err: any) => {
        const message = err.error?.message;
        if (this.router.url.includes('/courts')) {
          this.dashboardComponent.showModal('Erro', message);
        }
        this.isLoading = false;
      }
    });
  }

  transformSchedules(schedules: any): any {
    const transformedSchedules: any = {
      weekdays: { opening_time: null, closing_time: null, is_closed: false },
      saturday: { opening_time: null, closing_time: null, is_closed: false },
      sunday: { opening_time: null, closing_time: null, is_closed: false }
    };

    schedules.forEach((schedule: any) => {
      switch (schedule.day_of_week) {
        case 'monday':
        case 'tuesday':
        case 'wednesday':
        case 'thursday':
        case 'friday':
          transformedSchedules.weekdays.opening_time = schedule.opening_time;
          transformedSchedules.weekdays.closing_time = schedule.closing_time;
          transformedSchedules.weekdays.is_closed = schedule.is_closed;
          break;
        case 'saturday':
          transformedSchedules.saturday.opening_time = schedule.opening_time;
          transformedSchedules.saturday.closing_time = schedule.closing_time;
          transformedSchedules.saturday.is_closed = schedule.is_closed;
          break;
        case 'sunday':
          transformedSchedules.sunday.opening_time = schedule.opening_time;
          transformedSchedules.sunday.closing_time = schedule.closing_time;
          transformedSchedules.sunday.is_closed = schedule.is_closed;
          break;
        default:
          break;
      }
    });

    return transformedSchedules;
  }

  loadQuickCourts(): void {
    this.courtsService.index().subscribe({
      next: (data: any) => {
        this.courts = data.fields || [];

        this.courts = data.fields.map((court: any) => {
          if (court.schedules) {
            const schedules = this.transformSchedules(court.schedules);
            court.schedules = schedules;
            console.log(schedules)
          } else {
            court.schedules = {
              weekdays: { opening_time: null, closing_time: null, is_closed: false },
              saturday: { opening_time: null, closing_time: null, is_closed: false },
              sunday: { opening_time: null, closing_time: null, is_closed: false }
            };
          }
          return court;
        });
        console.log('cheguei')
      },
      error: (err: any) => {
        const message = err.error?.message;
        this.dashboardComponent.showModal(
          'Erro',
          message
        )
      }
    });
  }

  toggleService(court: any, field: string, event: Event): void {
    event.preventDefault();
    court[field] = !court[field];

    if (!court.company_id && court.company) {
      court.company_id = court.company.id;
    }
    this.updateCourt(court);
  }

  updateCourt(court: any): void {

    const formattedDate = this.convertToDateFormat(court.last_maintenance);

    const courtObj = {
      name: court.name,
      price_hour: court.price_hour,
      company_id: court.company_id,
      type_floor: court.type_floor,
      illumination: court.illumination,
      cover: court.cover,
      shower_room: court.shower_room,
      lockers: court.lockers,
      rent_equipment: court.rent_equipment,
      status: court.status,
      last_maintenance: formattedDate,
      schedules: {
        weekdays: this.formatTimeFields(court.schedules?.weekdays),
        saturday: this.formatTimeFields(court.schedules?.saturday),
        sunday: this.formatTimeFields(court.schedules?.sunday)
      }
    };

    this.courtsService.update(courtObj, court.id).subscribe({
      next: (res: any) => {
        const index = this.courts.findIndex(c => c.id === court.id);
        if (index !== -1) {
            this.courts[index] = res.court;
            this.loadQuickCourts();
        }
      },
      error: (err: any) => {
        console.error('Erro ao atualizar campo:', err);
        const message = err.error?.message || 'Erro desconhecido.';
        this.dashboardComponent.showModal('Erro', message);
      },
    });
  }

  convertToDateFormat(date: string): string {
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
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
      is_closed: schedule.is_closed === 1 ? true : false,
    };
  }
}
