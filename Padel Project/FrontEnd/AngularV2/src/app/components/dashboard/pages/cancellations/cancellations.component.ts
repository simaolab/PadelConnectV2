import { UsersService } from './../../../../services/users.service';
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
  isLoading = true;

  constructor(
    private cancellationsService: CancellationsService,
    private dashboardComponent: DashboardComponent,
    private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadCancellations();
  }

  loadCancellations(): void {
    this.cancellationsService.index().subscribe({
      next: (res: any) => {
        setTimeout(() => {
          this.cancellations = res.cancellations;
          this.isLoading = false;
      }, 1500)
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
