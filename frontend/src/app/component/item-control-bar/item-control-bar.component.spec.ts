import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemControlBarComponent } from './item-control-bar.component';

describe('ItemControlBarComponent', () => {
  let component: ItemControlBarComponent;
  let fixture: ComponentFixture<ItemControlBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemControlBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemControlBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
