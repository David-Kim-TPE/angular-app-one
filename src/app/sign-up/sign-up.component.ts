import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../user.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {
  private signUpInProgress = false;
  form: FormGroup;

  private signUp = {
    id: '',
    firstName: '',
    surname: '',
  };

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      id: [null, Validators.required],
      firstname: [null, [Validators.required, Validators.email]],
      surname: [null, Validators.required]
    });
  }

  checkWallet() {
    console.log('checkWalet()');
    return this.userService.checkWallet()
      .then((results) => {
        console.log('checkWallet() results: ', results);
        if (results['length'] > 0) {
          // this.loggedIn = true;
          const cardName = results[0].name;
          console.log('cardName: ' + cardName);
          return this.getCurrentUser();
        }
      })
      .catch(error => {
        // this.loggedIn = false;
        console.log('checkWalet()');
        // console.log('this.loggedIn: ' + this.loggedIn);
        // console.log('this.authenticated: ' + this.authenticated);
        console.log('error: ' + error);
      }
      );
  }

  onSignUp() {
    this.signUpInProgress = true;
    return this.userService.signUp(this.signUp)
      .then(() => {
        this.signUpInProgress = false;
        return this.getCurrentUser();
      });
  }

  getCurrentUser() {
    return this.userService.getCurrentUser()
      .then((currentUser) => {
        console.log('getCurrentUser(): ', currentUser);
        this.userService.currentUser = currentUser;
      });
  }
  /*
    getUserCard(cardName) {
      return this.userService.getUserCard(cardName)
        .then((cardUrl) => {
          console.log('cardUrl: ' + cardUrl);
          //this.cardUrl = cardUrl;
        });
    }
  
    getCurrentUserAndCard(walletName) {
      this.getCurrentUser();
      this.getUserCard(walletName);
    }
    */
}
