import { Component, OnInit } from '@angular/core';
import { CourtsService } from '../../../services/courts.service';
import { Observable } from 'rxjs';
import { SlideShowComponent } from '../../utilities/slide-show/slide-show.component';
import { MainContentComponent } from '../../utilities/main-content/main-content.component';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    SlideShowComponent,
    MainContentComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  totalCourts = 0;
  totalIndoorCourts = 0;
  totalOutdoorCourts = 0;

  constructor(private courtsService: CourtsService) {}

  ngOnInit(): void {
    this.getCourts().subscribe({
      next: (data: any) => {
        this.countFields(data.fields);
      },
      error: (error) => {
        console.error('Error fetching data from API', error);
      }
    });
  }

  // Function to get fields from the API using the service
  getCourts(): Observable<any> {
    return this.courtsService.index(); // Call the service function here
  }

  // Function to count the fields
  countFields(fields: any[]): void {
    this.totalCourts = 0;
    this.totalIndoorCourts = 0;
    this.totalOutdoorCourts = 0;

    fields.forEach(field => {
      this.totalCourts++;
      if (field.cover === 0) {
        this.totalIndoorCourts++;
      }
      if (field.cover === 1) {
        this.totalOutdoorCourts++;
      }
    });

    // Start counting the values gradually
    this.countIncrementally('totalCourts', 0, this.totalCourts);
    this.countIncrementally('totalIndoorCourts', 0, this.totalIndoorCourts);
    this.countIncrementally('totalOutdoorCourts', 0, this.totalOutdoorCourts);
  }

  // Function to count values incrementally
  countIncrementally(elementId: string, start: number, end: number): void {
    let current = start;
    const interval = setInterval(() => {
      if (current < end) {
        current++;
        const element = document.getElementById(elementId);
        if (element) {
          element.textContent = current.toString();
        }
      } else {
        clearInterval(interval);
      }
    }, 50);
  }
}
