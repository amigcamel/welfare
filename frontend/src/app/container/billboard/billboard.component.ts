import { AfterViewInit, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { LayoutConfigService } from '../../service/layout-config.service';
import { of } from 'rxjs';
import { delay, distinctUntilChanged, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent implements OnInit, AfterViewInit {
  images = [
    {
      img: '/assets/images/shop.jpg',
      uid: '3',
    },
    {
      img: '/assets/images/shop.jpg',
      uid: '1',
    },
    {
      img: '/assets/images/shop.jpg',
      uid: '2',
    },
    {
      img: '/assets/images/shop.jpg',
      uid: '3',
    },
    {
      img: '/assets/images/shop.jpg',
      uid: '1',
    },
  ];
  @ViewChild('photoList', {static: true}) itemList: ElementRef;
  private canNext = true;
  private canPre = true;
  public currentShop = 1;
  public isDesktop = true;
  public photoWidth = 650;
  constructor(private layoutConfigService: LayoutConfigService,
              private renderer: Renderer2) {
    this.layoutConfigService.setIsShowToolBar(true);
    this.layoutConfigService.setShowToolBarBottom(false);
    this.layoutConfigService.setShowCartInfo(false);
  }

  ngOnInit(): void {
    this.layoutConfigService.isDesktop$.pipe(distinctUntilChanged()).subscribe(status => {
      this.isDesktop = status;
      this.photoWidth = status ? 650 : 320;
      this.itemList.nativeElement.style.left = status ?  -this.photoWidth + 'px' : -this.photoWidth + 'px';
    });
  }
  ngAfterViewInit() {
    console.log(this.itemList);
  }
  next() {
    if (this.canNext) {
      this.currentShop = (this.currentShop + 1) % (this.images.length - 2)  === 0 ?
        (this.images.length - 2) : (this.currentShop + 1) % (this.images.length - 2);
      this.canNext = false;
      this.itemList.nativeElement.style.left = this.itemList.nativeElement.offsetLeft - this.photoWidth + 'px';
      of(true).pipe(delay(500), tap(() => {
        if (this.itemList.nativeElement.offsetLeft <= (-this.photoWidth * (this.images.length - 1))) {
          this.renderer.removeClass(this.itemList.nativeElement, 'shift');
          this.itemList.nativeElement.style.left = -this.photoWidth + 'px';
        }
      }), delay(200), tap(() => {
        this.renderer.addClass(this.itemList.nativeElement, 'shift');
        this.canNext = true;
      }), take(1)).subscribe(_ => {
      });
    }
  }
  pre() {
    if (this.canPre) {
      this.currentShop = (this.currentShop - 1 % (this.images.length - 2) ) === 0 ?
        (this.images.length - 2) : this.currentShop - 1;
      this.canPre = false;
      this.itemList.nativeElement.style.left = this.itemList.nativeElement.offsetLeft + this.photoWidth + 'px';
      of(true).pipe(delay(500), tap(() => {
        if (this.itemList.nativeElement.offsetLeft >= 0) {
          this.renderer.removeClass(this.itemList.nativeElement, 'shift');
          this.itemList.nativeElement.style.left = -this.photoWidth * (this.images.length - 2) + 'px';
        }
      }), delay(200), tap(() => {
        this.renderer.addClass(this.itemList.nativeElement, 'shift');
        this.canPre = true;
      }), take(1)).subscribe(w => {
      });
    }
  }
  dotSwitch(index) {
    this.currentShop = index;
    this.itemList.nativeElement.style.left = -this.photoWidth * index + 'px';
  }

}
