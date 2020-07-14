import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {

  constructor() { }
  @Output() public filterEmitter = new EventEmitter<string>();
  ngOnInit(): void {
  }
  handleFilter(event) {
    this.filterEmitter.emit(event.target.value);
  }

}
