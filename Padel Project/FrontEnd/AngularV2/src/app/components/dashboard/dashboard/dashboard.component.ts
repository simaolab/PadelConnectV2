import { Component, ViewChild } from '@angular/core';
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
export class DashboardComponent {
  @ViewChild(ModalComponent) modalComponent: ModalComponent | undefined;

    constructor(private router: Router) {}

    showModal(type: string, message: string): void {
      if (this.modalComponent) {
        this.modalComponent.showModal(type, message);
      }
    }

    closeModal() : void {
      if (this.modalComponent) {
        this.modalComponent.closeModal();
      }
    }
}
