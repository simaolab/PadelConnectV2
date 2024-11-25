import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-page',
  standalone: true,
  imports: [],
  templateUrl: './title-page.component.html',
  styleUrl: './title-page.component.css'
})
export class TitlePageComponent {
  @Input() dashboard: string = "Dashboard";
  @Input() pageText: string = "";
}
