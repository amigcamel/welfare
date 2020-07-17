import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCheckboxComponent } from './item-checkbox.component';

describe('ItemCheckboxComponent', () => {
  let component: ItemCheckboxComponent;
  let fixture: ComponentFixture<ItemCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
