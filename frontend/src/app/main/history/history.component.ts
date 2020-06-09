import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

    historyData: any;
    constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.historyData = this.activatedRoute.snapshot.data.historyData;
      console.log(this.historyData);
  }

}
