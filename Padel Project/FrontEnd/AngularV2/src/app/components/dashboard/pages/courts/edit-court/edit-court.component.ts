import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourtsService } from '../../../../../services/courts.service';

import { CardFormComponent } from '../../../utilities/card-form/card-form.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { Court } from '../../../../../models/court';

@Component({
  selector: 'app-edit-court',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    CardFormComponent,
    TitlePageComponent,
    DashboardComponent
  ],
  templateUrl: './edit-court.component.html',
  styleUrl: './edit-court.component.css'
})
export class EditCourtComponent {

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
    rent_equipment: 0
  }

  court_id: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService,
    private dashboardComponent: DashboardComponent
  ) {}

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadCourt();
  }

  loadCourt(): void {

    this.courtsService.show(this.court_id).subscribe({
      next: (court: any) => {
        const field = court.field;
        console.log(field.company.name)
        this.courtObj = {
          name: field.name,
          company_id: field.company.id,
          price_hour: field.price_hour,
          type_floor: field.type_floor,
          status: field.status,
          illumination: field.illumination,
          cover: field.cover,
          last_maintenance: field.last_maintenance,
          shower_room: field.shower_room,
          lockers: field.lockers,
          rent_equipment: field.rent_equipment
        };

        console.log(this.courtObj)
      },
      error: (err) => {
        const errorMessage = err?.error?.message

        this.dashboardComponent.showModal(
          'Error',
          errorMessage,
          () => {
            this.router.navigate(['/dashboard/courts']);
          }
        );
      }
    });
  }

  editCourt(): void {
    this.courtsService.edit(this.courtObj, this.court_id).subscribe({
      next: (res: any) => {
        if(res.status === 'success') {
          this.dashboardComponent.showModal(
            'Message',
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

        for (const company in errorDetails) {
          if (errorDetails.hasOwnProperty(company)) {
            this.formErrors[company] = errorDetails[company][0];
          }
        }
      }
    })
  }
}
