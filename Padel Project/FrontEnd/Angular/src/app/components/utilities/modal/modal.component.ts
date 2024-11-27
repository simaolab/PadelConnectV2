import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  Visible: boolean = false;
  type: string = '';
  message: string = '';

  @Output() modalClosed: EventEmitter<void> = new EventEmitter();

  showModal(type: string, message: string) : void {
    this.type = type;
    this.message = message;
    this.Visible = true;
  }

  closeModal() : void {
    this.Visible = false;
    this.modalClosed.emit();
  }
}

