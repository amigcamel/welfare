import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { LayoutConfigService } from '../../service/layout-config.service';
import { of, Subject } from 'rxjs';
import { delay, distinctUntilChanged, take, takeUntil, tap } from 'rxjs/operators';
import { BillboardService } from '../../service/billboard.service';
import { Billboard } from '../../interface/billboard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-billboard',
  templateUrl: './billboard.component.html',
  styleUrls: ['./billboard.component.scss']
})
export class BillboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('photoList', {static: false}) itemList: ElementRef;
  private unSub = new Subject<boolean>();
  private canNext = true;
  private canPre = true;
  public currentShop = 1;
  public isDesktop = true;
  public photoWidth = 650;
  public billBoardInfo: Billboard;
  public dotList = [];
  public shopName = '';
  constructor(private layoutConfigService: LayoutConfigService,
              private billboardService: BillboardService,
              private router: Router,
              private renderer: Renderer2) {
    this.layoutConfigService.setIsShowToolBar(true);
    this.layoutConfigService.setShowToolBarBottom(false);
    this.layoutConfigService.setShowCartInfo(false);
  }

  ngOnInit(): void {
    this.layoutConfigService.isDesktop$.pipe(takeUntil(this.unSub.asObservable()),
      distinctUntilChanged()).subscribe(status => {
      this.isDesktop = status;
      this.photoWidth = status ? 650 : 320;
      if (!!this.itemList) {
        this.itemList.nativeElement.style.left = status ?  -this.photoWidth + 'px' : -this.photoWidth + 'px';
      }
    });
    this.billboardService.getInfo().pipe(takeUntil(this.unSub.asObservable())).subscribe(data => {
      this.initData(data);
    });

  }
  ngAfterViewInit() {
    console.log(this.itemList);
  }
  private initData(data: Billboard) {
    this.shopName = data.items[0].name;
    this.dotList = ([...Array(data.items.length).keys()]).map(x => x + 1);
    const firstChild = data.items[0];
    const lastChild = data.items[data.items.length - 1];
    this.billBoardInfo = data;
    this.billBoardInfo.items = [lastChild, ...data.items, firstChild];
    if (!!this.itemList){
      this.itemList.nativeElement.style.left = status ?  -this.photoWidth + 'px' : -this.photoWidth + 'px';
    }
  }

  public next() {
    if (this.canNext) {
      this.currentShop = (this.currentShop + 1) % (this.billBoardInfo.items.length - 2)  === 0 ?
        (this.billBoardInfo.items .length - 2) : (this.currentShop + 1) % (this.billBoardInfo.items.length - 2);
      this.shopName = this.billBoardInfo.items[this.currentShop].name;
      this.canNext = false;
      this.itemList.nativeElement.style.left = this.itemList.nativeElement.offsetLeft - this.photoWidth + 'px';
      of(true).pipe(delay(500), tap(() => {
        if (this.itemList.nativeElement.offsetLeft <= (-this.photoWidth * (this.billBoardInfo.items.length - 1))) {
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
  public pre() {
    if (this.canPre) {
      this.currentShop = (this.currentShop - 1 % (this.billBoardInfo.items.length - 2) ) === 0 ?
        (this.billBoardInfo.items.length - 2) : this.currentShop - 1;
      this.shopName = this.billBoardInfo.items[this.currentShop].name;
      this.canPre = false;
      this.itemList.nativeElement.style.left = this.itemList.nativeElement.offsetLeft + this.photoWidth + 'px';
      of(true).pipe(delay(500), tap(() => {
        if (this.itemList.nativeElement.offsetLeft >= 0) {
          this.renderer.removeClass(this.itemList.nativeElement, 'shift');
          this.itemList.nativeElement.style.left = -this.photoWidth * (this.billBoardInfo.items.length - 2) + 'px';
        }
      }), delay(200), tap(() => {
        this.renderer.addClass(this.itemList.nativeElement, 'shift');
        this.canPre = true;
      }), take(1)).subscribe(w => {
      });
    }
  }
  public dotSwitch(index) {
    console.log(this.itemList);
    this.currentShop = index;
    this.itemList.nativeElement.style.left = -this.photoWidth * index + 'px';
    this.shopName = this.billBoardInfo.items[this.currentShop].name;
  }
  public navigateForm() {
    this.router.navigateByUrl('/afternoon-tea/form');
  }
  ngOnDestroy() {
    this.unSub.next(true);
    this.unSub.complete();
  }

}
