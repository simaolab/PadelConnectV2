import { CourtsService } from './../../../services/courts.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Inject, PLATFORM_ID } from '@angular/core';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

@Component({
  selector: 'slide-show',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule],
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit, AfterViewInit {

  swiper!: Swiper;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private courtsService: CourtsService) {}

  courts: any[] = [];

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSwiper();
      this.attachNavigationHandlers();
    }
  }

 ngOnInit(): void {
  this.loadCourts();
}

  loadCourts(): void {
    this.courtsService.index().subscribe({
      next: (data: any) => {
        this.courts = data.fields;
      },
      error: (err: any) => {
      }
    })
  }

  getCourtImage(filePath: string): string {
    return this.courtsService.getCourtImage(filePath);
  }

  initializeSwiper(): void {
    this.swiper = new Swiper('.slide-show-slider', {
      slidesPerView: 3,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  attachNavigationHandlers(): void {
    const nextButton = document.querySelector('.swiper-button-next');
    const prevButton = document.querySelector('.swiper-button-prev');

    if (nextButton && prevButton) {
      nextButton.addEventListener('click', () => {
        if (this.swiper) {
          this.swiper.slideNext();
        }
      });

      prevButton.addEventListener('click', () => {
        if (this.swiper) {
          this.swiper.slidePrev();
        }
      });
    }
  }
}
