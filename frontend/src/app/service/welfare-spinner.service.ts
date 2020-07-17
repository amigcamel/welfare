import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class WelfareSpinnerService {

  private spinnerRef: OverlayRef = this.cdkSpinnerCreate();

  constructor(
    private overlay: Overlay,
  ) {
  }

  private cdkSpinnerCreate() {
    return this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'coming-soon-spinner',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }
  showSpinner() {
    this.spinnerRef.attach(new ComponentPortal(MatSpinner));
  }
  stopSpinner() {
    this.spinnerRef.detach();
  }
}
