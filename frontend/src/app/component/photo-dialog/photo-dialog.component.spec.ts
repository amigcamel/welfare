import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoDialogComponent } from './photo-dialog.component';
import { MaterialModule } from "../../material/material.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

describe('PhotoDialogComponent', () => {
  let component: PhotoDialogComponent;
  let fixture: ComponentFixture<PhotoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoDialogComponent ],
      imports: [
        MaterialModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
