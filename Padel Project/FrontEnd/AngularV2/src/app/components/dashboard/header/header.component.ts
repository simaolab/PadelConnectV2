import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username = localStorage.getItem('username');

  date: string = "";
  hour: string = "";

  @Output() componentLoaded = new EventEmitter<void>();

  ngOnInit() {
    this.componentLoaded.emit();
  }
}
