import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SideBarService } from "../../service/side-bar.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  constructor(private router: Router,
              private sideBarService: SideBarService) { }

  ngOnInit(): void {
  }
  public navigateTo(url: string) {
    this.router.navigateByUrl(url);
    this.sideBarService.setIsShow(false);
  }
}
