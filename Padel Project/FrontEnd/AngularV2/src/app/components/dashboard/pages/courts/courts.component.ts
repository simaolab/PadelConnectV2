import { CourtsService } from './../../../../services/courts.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

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
  styleUrl: './courts.component.css'
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
            if(this.router.url.includes('/courts')) {
              this.dashboardComponent.showModal(
                'Mensagem',
                data.message
              );
            }
          } else {
            this.courts = data.fields;
          }
          this.isLoading = false;
        }, 1500);
      },

      error: (err: any) => {
        const message = err.error?.message;
        if(this.router.url.includes('/courts')) {
          this.dashboardComponent.showModal(
            'Erro',
            message
          );
        }
        this.isLoading = false;
      }
    })
  }

  loadQuickCourts(): void {
    this.courtsService.index().subscribe({
      next: (data: any) => {
        this.courts = data.fields || [];
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
    court[field] = court[field] === 1 ? 0 : 1;
    this.updateCourt(court);
  }

  updateCourt(court: any): void {
    const updatedCourt = {
      ...court,
      company_id: court.company.id,
    };

    this.courtsService.update(court.id, updatedCourt).subscribe({
      next: (res: any) => {
        const index = this.courts.findIndex(c => c.id === court.id);
        if (index !== -1) {
          setTimeout(() => {
            this.courts[index] = res.court;
            this.loadQuickCourts();
          }, 200)
        }
      },
      error: (err: any) => {
        const message = err.error?.message;
        console.error('Erro ao atualizar campo:', err);
        this.dashboardComponent.showModal('Erro', message);
      }
    });
  }
}
