import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  getAllOrder() {
    return this.http.get('/api/order');
  }
  getOrder(user) {
    return this.http.get(`/api/order?user=${user}`);
  }
  updateOrder(user, collected) {
    console.log(collected);
    return this.http.post(`/api/order?user=${user}`, {
      data: {
        collected: !collected
      }
    });
  }
  updateByQr(hash) {
    return this.http.post(`/api/qr`, {
      qr: hash
    });
  }

}
