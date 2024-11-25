import { Component } from '@angular/core';
import { TitlePageComponent } from '../utilities/title-page/title-page.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {

}
