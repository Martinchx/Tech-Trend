import { Component, OnInit } from '@angular/core';

declare const bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    this.initializeCarousel();
  }
  initializeCarousel(): void {
    const heroCarousel = document.getElementById(
      'hero-carousel'
    ) as HTMLElement;
    if (heroCarousel) {
      new bootstrap.Carousel(heroCarousel, {
        interval: 3000,
      });
    }
  }
}
