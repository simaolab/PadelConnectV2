import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  username = localStorage.getItem('username');
  date: string = "";
  hour: string = "";

  @Output() menuToggled = new EventEmitter<void>();

  ngOnInit(): void {
    if (window.location.pathname.includes('/dashboard')) {
      this.updateDateTime();
      setInterval(() => this.updateDateTime(), 1000);
    }
  }

  toggleMenu(): void {
    this.menuToggled.emit();
  }

  updateDateTime(): void {
    const now = new Date();

    this.date = this.formatDate(now);
    this.hour = this.formatTime(now);
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long'
    };
    return new Intl.DateTimeFormat('pt-PT', options).format(date);
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Intl.DateTimeFormat('pt-PT', options).format(date);
  }
}
