import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class UserService {

  accessTokenExists: boolean;
  accessToken: string;
  currentUser: string;
  cardExists: boolean;
  currentUserName: string;
  cards: any;

  constructor(private httpClient: HttpClient, private http: Http) { }

  // Get Wallet from API with Credentials
  checkWallet() {
    return this.httpClient.get('/api/wallet', { withCredentials: true })
      .catch(this.handleError)
      .toPromise().then((results) => {
        this.cards = results;
        console.log('checkWallet() results: ', results);
        if (results['length'] > 0) {
          // this.loggedIn = true;
          this.cardExists = true;
          const cardName = results[0].name;
          console.log('cardName: ' + cardName);
          // console.log('this.loggedIn: ' + this.loggedIn);

          // return this.getCurrentUserAndCard(cardName);
          return this.getCurrentUser();

        }
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  // Create Participant and create identities, beware of the "Card" section.
  signUp(data) {
    const participantUser = {
      $class: 'org.example.basic.SampleParticipant',
      'participantId': data.id,
      'firstName': data.firstName,
      'lastName': data.surname
    };

    return this.httpClient.post('http://localhost:3001/api/SampleParticipant', participantUser).toPromise()
      .then(() => {
        const identity = {
          participant: 'org.example.basic.SampleParticipant#' + data.id,
          userID: data.id,
          options: {}
        };
        console.log('participant %1 created ', data.id);
        return this.httpClient.post('http://localhost:3001/api/system/identities/issue', identity, { responseType: 'blob' }).toPromise();
      })
      .then((cardData: Blob) => {
        console.log('CARD-DATA', cardData);
        const file = new File([cardData], 'myCard.card', { type: 'application/octet-stream', lastModified: Date.now() });

        const formData = new FormData();
        formData.append('card', file);

        const headers = new HttpHeaders();
        headers.set('Content-Type', 'multipart/form-data');
        return this.httpClient.post('/api/wallet/import', formData, {
          withCredentials: true,
          headers
        }).toPromise();
      });
  }

  // Get Current User using /api/system/ping
  getCurrentUser() {
    return this.httpClient.get('/api/system/ping', { withCredentials: true })
      .toPromise()
      .then((data) => {
        const currentUser = data['participant'];
        console.log('getCurrentUser(): ', currentUser);
        this.currentUser = currentUser;
        console.log(currentUser.split('#'));
        this.currentUserName = currentUser.split('#').pop();
        return currentUser;
      });
  }

  // Get User Card by calling /api/wallet/{cardName}/export
  getUserCard(cardName) {
    return this.httpClient.get('/api/wallet/' + cardName + '/export', { withCredentials: true })
      .toPromise()
      .then((result: Blob) => {
        console.log('getUserCard() result:', result);
        return result;
      });
  }

  bindUserCard(cardName) {
    const params = {
      name: cardName
    };
    return this.httpClient.post('/api/wallet/' + cardName + '/setDefault', params, { withCredentials: true })
      .toPromise()
      .then((res) => {
        console.log('res: ', res);
      });
  }

  // Handles Error
  private handleError(error: any): Observable<string> {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
