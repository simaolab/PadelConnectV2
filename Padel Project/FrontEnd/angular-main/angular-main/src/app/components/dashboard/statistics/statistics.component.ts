import { Component } from '@angular/core';
import { TitlePageComponent } from '../utilities/title-page/title-page.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {

}
