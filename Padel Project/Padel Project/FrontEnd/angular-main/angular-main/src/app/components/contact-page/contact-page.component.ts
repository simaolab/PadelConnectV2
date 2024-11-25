import { Component } from '@angular/core';
import { PageTopComponent } from '../page-top/page-top.component';

@Component({
  selector: 'catarina',
  standalone: true,
  imports: [
    PageTopComponent
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

}
