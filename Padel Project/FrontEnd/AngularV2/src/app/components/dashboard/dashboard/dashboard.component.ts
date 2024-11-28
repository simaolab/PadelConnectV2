import { Component, ViewChild, AfterViewInit  } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { ModalComponent } from '../../utilities/modal/modal.component';


@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
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

    onHeaderLoaded() {
      document.dispatchEvent(new Event('headerLoaded'));
    }

    ngAfterViewInit(): void {
      // Usar setTimeout para garantir que a visualização foi inicializada corretamente
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
          console.log('Modal fechado, executando callback');
          callback();
        });
      } else {
        console.log('no callback')
      }
    }

    closeModal() : void {
      if (this.modalComponent) {
        this.modalComponent.closeModal();
      }
    }
}
