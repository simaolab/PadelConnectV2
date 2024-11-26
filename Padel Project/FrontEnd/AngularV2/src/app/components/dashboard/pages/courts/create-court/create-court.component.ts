import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourtsService } from '../../../../../services/courts.service';
import { FormsModule } from '@angular/forms';

import { CardTableComponent } from '../../../utilities/card-table/card-table.component';
import { TitlePageComponent } from '../../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../../dashboard/dashboard.component';

@Component({
  selector: 'app-create-court',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitlePageComponent,
    CardTableComponent,
    DashboardComponent,
  ],
  templateUrl: './create-court.component.html',
  styleUrl: './create-court.component.css'
})

export class CreateCourtComponent {
  courtObj = {
    name: 'Teste 3214',
    company_id: 1,
    price_hour: 5,
    type_floor: 'Sinteticoa',
    status: 'Ok',
    cover: 0,
    last_maintenance: ''
  }

    constructor(
      private router: Router,
      private courtsService: CourtsService,
      private dashboardComponent: DashboardComponent,
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
              res.message
            )
          }
        },
        error: (err: any) => {
          const errorMessage = err.error?.message;
          this.dashboardComponent.showModal(
            'Error',
            errorMessage
          );
        }
      })
    }
}
