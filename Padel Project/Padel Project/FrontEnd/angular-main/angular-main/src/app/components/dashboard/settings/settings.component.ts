import { Component } from '@angular/core';
import { TitlePageComponent } from '../utilities/title-page/title-page.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
