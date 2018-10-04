import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { AnimateComponent } from '../animate/animate.component';
import { AnimateService } from '../animate/animate.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {
  @ViewChild('AnimateComponent') animateComponent: AnimateComponent;
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private animateService: AnimateService) { }

  ngOnInit() { }

  bindUserCard(card) {
    console.log(card.name);
    this.animateService.toggle(1, 'Binding User Card...');
    return this.userService.bindUserCard(card.name).then(() => {
      this.userService.checkWallet().then(() => {
        this.animateService.toggle(0);
        this.activatedRoute.queryParams.subscribe(params => {
          const returnUrl = params['returnUrl'];
          if (returnUrl) {
            this.router.navigate([returnUrl]);
          }
        });
      });
    });
  }

  importFileChanged(event) {
    const file = event.target.files[0];
    if (file) {

      this.userService.importCard(file).then(() => {
        console.log('done');
        this.userService.checkWallet();
      });
    }
  }

}
