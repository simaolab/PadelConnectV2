import { Component, Input } from '@angular/core';

@Component({
  selector: 'page-top',
  standalone: true,
  imports: [],
  templateUrl: './page-top.component.html',
  styleUrl: './page-top.component.css'
})
export class PageTopComponent {
  @Input() title: string = "";
  @Input() homeText: string = "Home";
  @Input() pageText: String = "Pages";
}
