import { Component } from '@angular/core';
import { PageTopComponent } from './../../utilities/page-top/page-top.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'contact-page',
  standalone: true,
  imports: [
    PageTopComponent,
    MainContentComponent
  ],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {

  personalData = {
      email: 'padelconnect@gmail.com',
      phone: '912345678',
      address: 'Rua Exemplo, 123'
    }
}

