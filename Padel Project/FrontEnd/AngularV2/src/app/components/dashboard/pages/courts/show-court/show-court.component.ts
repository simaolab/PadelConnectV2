import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourtsService } from '../../../../../services/courts.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-show-court',
  standalone: true,
  imports: [
        CommonModule,
        FormsModule,
        TitlePageComponent,
        CardFormComponent,
        DashboardComponent,
  ],
  templateUrl: './show-court.component.html',
  styleUrl: './show-court.component.css'
})
export class ShowCourtComponent {
  courtObj = {
    name: '',
    company_name: '',
    price_hour: 0,
    type_floor: '',
    status: '',
    cover: 0,
    last_maintenance: ''
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService,
    private dashboardComponent: DashboardComponent
  ) {}

  ngOnInit(): void {
    this.showCourt();
  }

  showCourt(): void {
    const courtId = this.activatedRoute.snapshot.paramMap.get('id');

    if (courtId) {
      const courtIdNumber = Number(courtId);

      this.courtsService.show(courtIdNumber).subscribe({
        next: (court: any) => {
          const field = court.field;
          console.log(field.company.name)
          this.courtObj = {
            name: field.name,
            company_name: field.company.name,
            price_hour: field.price_hour,
            type_floor: field.type_floor,
            status: field.status,
            cover: field.cover,
            last_maintenance: field.last_maintenance

          };
        },
        error: (err) => {
          console.error('Erro ao buscar dados da quadra:', err);
        }
      });
    } else {
      console.error('Court ID is missing or invalid.');
    }
  }

  deleteCourt(event: Event): void {
    event.preventDefault();

    const courtId = this.activatedRoute.snapshot.paramMap.get('id');

    const courtIdNumber = Number(courtId);

    this.courtsService.delete(courtIdNumber).subscribe({
      next: (res: any) => {
        this.dashboardComponent.showModal(
          'Success',
          res.message
        )
      }
    });
  }
}
