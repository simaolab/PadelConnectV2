import { Component, ViewChild, AfterViewInit  } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../utilities/modal/modal.component';


@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    RouterOutlet,
    ModalComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit{
    @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

    constructor(private router: Router) {}

    isSidebarClosed: boolean = false;

    onHeaderLoaded() {
      document.dispatchEvent(new Event('headerLoaded'));
    }

    ngAfterViewInit(): void {
      setTimeout(() => {
        if (this.modalComponent) {
          this.modalComponent.modalClosed?.subscribe(() => {
          });
        }
      });
    }

    showModal(type: string, message: string, callback?: () => void): void {
      if (this.modalComponent) {
        this.modalComponent.showModal(type, message);
      }

      if (callback) {
        this.modalComponent?.modalClosed?.subscribe(() => {
          callback();
        });
      }
    }

    closeModal() : void {
      if (this.modalComponent) {
        this.modalComponent.closeModal();
      }
    }

    onMenuToggled(): void {
      this.isSidebarClosed = !this.isSidebarClosed;
    }
}
