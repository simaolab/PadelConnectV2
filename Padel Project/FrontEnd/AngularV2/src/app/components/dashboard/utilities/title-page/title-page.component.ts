import { Component, Input } from '@angular/core';

@Component({
  selector: 'title-page',
  standalone: true,
  imports: [],
  templateUrl: './title-page.component.html',
  styleUrl: './title-page.component.css'
})
export class TitlePageComponent {
  @Input() pageText: string = "";
}
