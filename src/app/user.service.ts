import { Injectable, EventEmitter } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'ngx-cookie-service';
import { AnimateService } from './animate/animate.service';


@Injectable()
export class UserService {

  accessTokenExists: boolean;
  accessToken: string;
  currentUser: string;
  cardExists: boolean;
  currentUserName: string;
  cards: any;

  constructor(
    private cookieService: CookieService,
    private httpClient: HttpClient,
    private http: Http,
    private animateService: AnimateService) { }

  checkAccessToken() {
    // check access_token
    return this.accessTokenExists = this.cookieService.check('access_token');
  }

  clearCookie() {
    return this.cookieService.deleteAll();
  }

  // Get Wallet from API with Credentials
  checkWallet() {
    return this.httpClient.get('/api/wallet', { withCredentials: true, responseType: 'json' })
      .toPromise()
      .then(results => {
        this.cards = results;
        console.log('checkWallet() results: ', results);
        if (results['length'] > 0) {
          this.cardExists = true;
          const cardName = results[0].name;
          console.log('cardName: ' + cardName);
          return this.getCurrentUser();
        }
      })
      .catch((error: HttpErrorResponse) => {
        this.handleError(error);
      });
  }

  // Create Participant and create identities, beware of the "Card" section.
  signUp(data, callback = null) {
    const participantUser = {
      $class: 'org.example.basic.SampleParticipant',
      'participantId': data.id,
      'firstName': data.firstName,
      'lastName': data.surname
    };

    return this.httpClient.post('http://localhost:3001/api/SampleParticipant', participantUser)
      .toPromise()
      .then(res => {
        const identity = {
          participant: 'org.example.basic.SampleParticipant#' + data.id,
          userID: data.id,
          options: {}
        };
        console.log('participant %1 created ', data.id);
        console.log('then 1');
        return this.httpClient.post('http://localhost:3001/api/system/identities/issue', identity, { responseType: 'blob' })
          .toPromise();
      })
      .then((cardData: Blob) => {
        console.log('then 2');
        return this.importCard(cardData);
      })
      .then(res => {
        console.log('then 4');
        return callback();
      })
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  importCard(cardData: Blob) {
    console.log('CARD-DATA', cardData);
    const file = new File([cardData], 'myCard.card', { type: 'application/octet-stream', lastModified: Date.now() });

    const formData = new FormData();
    formData.append('card', file);

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    console.log('this', this);
    return this.httpClient.post('/api/wallet/import', formData, {
      withCredentials: true,
      headers
    })
    .toPromise()
    .then(res => {
      console.log('then 3');
      console.log('card imported: ', res);
      return this.checkWallet();
    });
  }

  // Get Current User using /api/system/ping
  getCurrentUser() {
    return this.httpClient.get('/api/system/ping', { withCredentials: true })
      .toPromise()
      .then(data => {
        const currentUser = data['participant'];
        console.log('getCurrentUser(): ', currentUser);
        this.currentUser = currentUser;
        console.log(currentUser.split('#'));
        this.currentUserName = currentUser.split('#').pop();
        return currentUser;
      })
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  // Get User Card by calling /api/wallet/{cardName}/export
  getUserCard(cardName) {
    return this.httpClient.get('/api/wallet/' + cardName + '/export', { withCredentials: true })
      .toPromise()
      .then((result: Blob) => {
        console.log('getUserCard() result:', result);
        return result;
      })
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  bindUserCard(cardName) {
    const params = {
      name: cardName
    };
    return this.httpClient.post('/api/wallet/' + cardName + '/setDefault', params, { withCredentials: true })
      .toPromise()
      .then(res => {
        console.log('res: ', res);
      })
      .catch((error: HttpErrorResponse) => this.handleError(error));
  }

  // Handles Error
  private handleError(error: HttpErrorResponse | any): Observable<string> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead

    if (error.status === 401) {
      this.logout('Authorization failed, logging out...');
    }
    return Observable.throw(errMsg);
  }

  logout(msg: string = null): void {
    let logoutMsg = 'logging out...';
    if (msg) { logoutMsg = msg; }
    this.animateService.toggle(1, logoutMsg);
    this.clearCookie();
    window.location.href = 'http://localhost:3000/auth/logout';
  }
}
