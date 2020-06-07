import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from "../../../../@fuse/services/config.service";
import { Location } from "@angular/common";

@Component({
  selector: 'app-no-auth',
  templateUrl: './no-auth.component.html',
  styleUrls: ['./no-auth.component.scss']
})
export class NoAuthComponent implements OnInit {

  constructor(private _fuseConfigService: FuseConfigService, private location: Location) { }

  ngOnInit(): void {
      this._fuseConfigService.config = {
          layout: {
              navbar   : {
                  hidden: true
              },
              toolbar  : {
                  hidden: true
              },
              footer   : {
                  hidden: true
              },
              sidepanel: {
                  hidden: true
              }
          }
      };
  }
  goBack() {
      this.location.back();
  }

}
