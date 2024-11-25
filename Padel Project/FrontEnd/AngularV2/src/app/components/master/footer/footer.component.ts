import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrivacyPolicyPageComponent } from '../../pages/privacy-policy-page/privacy-policy-page.component';

@Component({
  selector: 'footer',
  standalone: true,
  imports: [PrivacyPolicyPageComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
