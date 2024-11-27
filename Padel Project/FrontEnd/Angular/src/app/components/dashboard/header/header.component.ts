import { Component, OnInit, Output, EventEmitter, AfterViewInit  } from '@angular/core';


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

  ngAfterViewInit(): void {
    // Aguardar o carregamento total da view antes de executar a manipulação do DOM
    setTimeout(() => {
      this.componentLoaded.emit();
    }, 0);
  }
}
