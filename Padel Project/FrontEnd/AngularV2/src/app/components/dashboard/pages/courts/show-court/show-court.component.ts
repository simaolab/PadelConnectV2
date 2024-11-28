import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
    RouterModule,
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

  court_id: number = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private courtsService: CourtsService,
    private dashboardComponent: DashboardComponent
  ) {}

  ngOnInit(): void {
    this.court_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.showCourt();
  }

  showCourt(): void {

      this.courtsService.show(this.court_id).subscribe({
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

  deleteCourt(event: Event): void {
    event.preventDefault();

    this.courtsService.delete(this.court_id).subscribe({
      next: (res: any) => {
        this.dashboardComponent.showModal(
          'Success',
          res.message,
          () => {
            this.router.navigate(['/dashboard/courts']);
          }
        )
      },
      error: (err) => {
        const errorMessage = err?.error?.message

        this.dashboardComponent.showModal(
          'Error',
          errorMessage
        );
      }
    });
  }
}
