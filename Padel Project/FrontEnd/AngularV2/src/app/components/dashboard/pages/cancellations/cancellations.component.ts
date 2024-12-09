import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { CancellationsService } from '../../../../services/cancellations.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancellations',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    DashboardComponent,
  ],
  templateUrl: './cancellations.component.html',
  styleUrl: './cancellations.component.css'
})
export class CancellationsComponent {

  cancellations: any[] = [];

  constructor(
    private cancellationsService: CancellationsService,
    private dashboardComponent: DashboardComponent,) {}

  ngOnInit(): void {
    this.loadCancellations();
  }

  loadCancellations(): void {
    this.cancellationsService.index().subscribe({
      next: (res: any) => {
        this.cancellations = res;
        console.log(this.cancellations)
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
}
