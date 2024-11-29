import { Component } from '@angular/core';
import { CourtsService } from '../../../services/courts.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';
import { CourtsCardComponent } from '../../utilities/courts-card/courts-card.component';
import { ModalComponent } from '../../utilities/modal/modal.component';

@Component({
  selector: 'courts-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageTopComponent,
    MainContentComponent,
    CourtsCardComponent,
    ModalComponent
  ],
  templateUrl: './courts-page.component.html',
  styleUrl: './courts-page.component.css'
})
export class CourtsPageComponent {
  courts: any[] = [];

  constructor(
    private router: Router,
    private courtsService: CourtsService,
  ) {}

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.courtsService.index().subscribe({
      next: (data: any) => {
        this.courts = data.fields;
      },
      error: (err: any) => {
      }
    })
  }
}
