import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() items: any[] = [];
  @Input() labelKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() placeholder: string = 'Selecione uma opção';
  @Output() selectionChange = new EventEmitter<any>();

  selectedItem: any = null;

  selectItem(item: any) {
    this.selectedItem = item;
    this.selectionChange.emit(item);
  }

}
