import { Component, ViewChild } from '@angular/core';
import { CourtsService } from '../../../services/courts.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, Subject } from 'rxjs';

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
  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

  courts: any[] = [];

  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private router: Router,
    private courtsService: CourtsService,
  ) {}

  ngOnInit(): void {
    this.loadCourts();

    this.searchSubject.pipe(debounceTime(300)).subscribe((searchTerm: string) => {
      this.searchCourts(searchTerm);
    });
  }

  loadCourts(): void {
    this.courtsService.index().subscribe({
      next: (data: any) => {
        this.courts = data.fields;
        console.log(this.courts)
      },
      error: (err: any) => {
        const message = err.error?.message;
        this.modalComponent?.showModal(
          'Erro',
          message
        );
      }
    })
  }

  searchCourts(term: string): void {
    if (term.trim() === '') {
      this.loadCourts();
    } else {
      this.courtsService.search(term).subscribe({
        next: (data: any) => {
          this.courts = data.fields;
        },
        error: (err: any) => {
          const message = err.error?.message;
          this.modalComponent?.showModal(
            'Erro',
            message
          );
        }
      });
    }
  }

  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.searchSubject.next(searchTerm);
  }
}
