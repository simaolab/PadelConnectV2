import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent {
  @Input() items: any[] = [];
  @Input() labelKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() placeholder: string = 'Selecione uma opção';
  @Output() selectionChange = new EventEmitter<any>();

  selectedItem: any = null;
  isOpen: boolean = false;  // Controle para abrir/fechar o menu

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.isOpen = false;  // Fecha o menu após a seleção
  }
}
