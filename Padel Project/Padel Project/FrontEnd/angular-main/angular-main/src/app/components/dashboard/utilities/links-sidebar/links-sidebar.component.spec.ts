import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinksSidebarComponent } from './links-sidebar.component';

describe('LinksSidebarComponent', () => {
  let component: LinksSidebarComponent;
  let fixture: ComponentFixture<LinksSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinksSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinksSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
