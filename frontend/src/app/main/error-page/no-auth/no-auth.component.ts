import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from "../../../../@fuse/services/config.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-no-auth',
  templateUrl: './no-auth.component.html',
  styleUrls: ['./no-auth.component.scss']
})
export class NoAuthComponent implements OnInit {

  constructor(private _fuseConfigService: FuseConfigService, private router: Router) {
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

  ngOnInit(): void {

  }
  goBack() {
      this.router.navigateByUrl('/login');
  }

}
