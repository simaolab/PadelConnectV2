import { Component } from '@angular/core';

@Component({
  selector: 'header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  username = localStorage.getItem('username');

  date: string = "12 de Novembro";
  hour: string = "16:00";
}
