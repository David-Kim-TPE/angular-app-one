import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // console.log('this.cards:', this.cards);
    // this.cards = this.loginPanel.cards;
    // console.log('this.cards:', this.cards);
  }

  /*
  ngAfterViewInit() {
    console.log('hi');
     console.log('this.cards:', this.cards);
     this.cards = this.loginPanel.cards;
     console.log('this.cards:', this.cards);
  }
  */

 bindUserCard(card) {
   console.log(card.name);
   return this.userService.bindUserCard(card.name).then(() => {
     this.userService.checkWallet().then(() => {
       this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl = params['returnUrl'];
        this.router.navigate([returnUrl]);
       });
     });
   });
 }

}
