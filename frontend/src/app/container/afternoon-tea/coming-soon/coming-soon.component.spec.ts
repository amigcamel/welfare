import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComingSoonComponent } from './coming-soon.component';
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

describe('ComingSoonComponent', () => {
  let component: ComingSoonComponent;
  let fixture: ComponentFixture<ComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComingSoonComponent ],
      imports: [
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
