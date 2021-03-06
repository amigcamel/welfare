import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormComponent } from './form.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from '../../../material/material.module';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import * as data from '../../../service/mock2.json';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MaterialModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                formData: data
              }
            }
          }
      }],
    }
    )
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
