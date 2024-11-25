import { CourtsService } from './../../../../services/courts.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CardTableComponent } from '../../utilities/card-table/card-table.component';
import { ModalComponent } from '../../../utilities/modal/modal.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';

@Component({
  selector: 'courts',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    CardTableComponent,
    ModalComponent,
    DashboardComponent
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
                  'Message',
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
          if(this.router.url.includes('/courts')) {
            this.dashboardComponent.showModal(
              'Error',
              'Erro ao tentar carregar a lista de campos'
            );
          }
          this.isLoading = false;
        }
      })
    }
}
