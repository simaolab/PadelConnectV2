import { Component } from '@angular/core';
import { TitlePageComponent } from '../../utilities/title-page/title-page.component';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [
    TitlePageComponent
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
