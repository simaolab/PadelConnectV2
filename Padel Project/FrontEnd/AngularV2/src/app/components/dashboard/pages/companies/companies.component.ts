import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompaniesService } from '../../../../services/companies.service';

import { CardTableComponent } from '../../utilities/card-table/card-table.component';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { AddButtonComponent } from '../../utilities/add-button/add-button.component';

@Component({
  selector: 'companies',
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    CardTableComponent,
    DashboardComponent,
    AddButtonComponent
  ],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.css'
})
export class CompaniesComponent {
  companies: any[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private companiesService: CompaniesService,
    private dashboardComponent: DashboardComponent,
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companiesService.index().subscribe({
      next: (data: any) => {
        console.log(data)
        setTimeout(() => {
          if(data && data.message) {
            if(this.router.url.includes('/companies')) {
              this.dashboardComponent.showModal(
                'Message',
                data.message
              );
            }
          } else {
            this.companies = data.companies;
            console.log(this.companies)
          }
          this.isLoading = false;
        }, 1500);
      },

      error: (err: any) => {
        if(this.router.url.includes('/companies')) {
          const errorMessage = err.error?.message;
          this.dashboardComponent.showModal(
            'Error',
            errorMessage
          );
        }
        this.isLoading = false;
      }
    })
  }
}
