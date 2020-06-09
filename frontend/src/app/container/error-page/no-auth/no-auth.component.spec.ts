import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAuthComponent } from './no-auth.component';
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

describe('NoAuthComponent', () => {
  let component: NoAuthComponent;
  let fixture: ComponentFixture<NoAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ NoAuthComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
