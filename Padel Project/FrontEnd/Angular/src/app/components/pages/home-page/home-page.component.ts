import { Component } from '@angular/core';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';
import { SlideShowComponent } from '../../utilities/slide-show/slide-show.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    MainContentComponent, SlideShowComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
