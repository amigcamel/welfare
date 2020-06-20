import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrcode-scanner',
  templateUrl: './qrcode-scanner.component.html',
  styleUrls: ['./qrcode-scanner.component.scss']
})
export class QrcodeScannerComponent implements OnInit {

  constructor() { }
  info: string;
  ngOnInit(): void {
  }

  print(result) {
    this.info = result;
  }

}
