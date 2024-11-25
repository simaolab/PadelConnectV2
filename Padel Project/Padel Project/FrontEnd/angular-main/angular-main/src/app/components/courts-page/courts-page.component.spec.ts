import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtsPageComponent } from './courts-page.component';

describe('CourtsPageComponent', () => {
  let component: CourtsPageComponent;
  let fixture: ComponentFixture<CourtsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
