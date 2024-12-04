import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() items: any[] = [];
  @Input() labelKey: string = 'name';
  @Input() valueKey: string = 'id';
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() value: any;
  @Output() selectionChange = new EventEmitter<any>();

  selectedItem: any = null;
  isOpen: boolean = false;

  ngOnInit(): void {
    this.syncSelectedItem();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] || changes['items']) {
      this.syncSelectedItem();
    }
  }

  private syncSelectedItem(): void {
    this.selectedItem = this.items.find(item => item[this.valueKey] === this.value) || null;
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: any): void {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.isOpen = false;
  }
}
