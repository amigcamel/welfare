import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { LoginComponent } from "../login/login.component";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    let fakeActivatedRoute: ActivatedRoute;
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: 'login', component: LoginComponent }
          ]
        ),
        HttpClientModule,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: {queryParams: of([{id: 1}])}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
