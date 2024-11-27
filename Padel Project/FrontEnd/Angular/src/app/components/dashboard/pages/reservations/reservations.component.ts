import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';

@Component({
  selector: 'reservations',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css'
})
export class ReservationsComponent {

}
