import { Injectable } from '@angular/core';

import { Token } from '../models/Token';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { longStackSupport } from 'q';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const Api_Url = `https://efa-gardenapp-backend.herokuapp.com/api/product`;
@Injectable()
export class AuthService {
  userInfo: Token;
  isLoggedIn = new Subject<boolean>();

  constructor(private _http: HttpClient, private _router: Router) { }

  login(loginInfo) {
    const str =
      `grant_type=password&username=${encodeURI(loginInfo.email)}&password=${encodeURI(loginInfo.password)}`;
    return this._http.post(`${Api_Url}/token`, str).subscribe((token: Token) => {
      localStorage.setItem('id_token', token.access_token);
      this.userInfo = token;
      this.isLoggedIn.next(true);
      this._router.navigate(['/']);
    });
  }
  currentUser(): Observable<Object> {
    if (!localStorage.getItem('id_token')) { return new Observable(observer => observer.next(false)); }

    return this._http.get(`${Api_Url}/api/Account/UserInfo`, { headers: this.setHeader() });
  }
logout(){
  localStorage.clear();
  this.isLoggedIn.next(false);

  const authHeader = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('id_token')}`);

  this._http.post(`${Api_Url}/api/ACcount/Logout`, { headers: authHeader });
  this._router.navigate(['/login']);
}
private setHeader(): HttpHeaders{

  return new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('id_token')}`);
}
}


