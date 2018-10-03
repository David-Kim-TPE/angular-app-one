import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  constructor(private cookieService: CookieService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    // prepare route
    this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .subscribe(() => {
        const routeTree = this.router.parseUrl(this.router.url);
        let routePath = '/';
        console.log('routeTree.root.children[\'primary\']', routeTree.root.children['primary']);
        if (routeTree.root.children['primary']) {
          routePath = routeTree.root.children['primary'].segments.map(it => it.path).join('/');
        }
        // check access_token
        this.userService.accessTokenExists = this.cookieService.check('access_token');

        if (this.userService.accessTokenExists) {
          console.log('accessTokenExists: ', this.userService.accessTokenExists);

          if (routePath === 'SignUp') {
            return;
          }
          console.log('!this.userService.currentUser', !this.userService.currentUser);
          if (!this.userService.currentUser) {
            this.userService.checkWallet().then(() => {
              // if no card exists, go to signup
              console.log('!this.userService.cardExists', !this.userService.cardExists);
              if (!this.userService.cardExists) {
                console.log('routePath', routePath, routePath !== 'SignUp');
                if (routePath !== 'SignUp') {
                  return this.router.navigate(['SignUp'], { queryParams: { returnUrl: routePath } });
                }
                // else go choose a card
              } else if (!this.userService.currentUser) {
                if (routePath !== 'Cards') {
                  return this.router.navigate(['Cards'], { queryParams: { returnUrl: routePath } });
                }
              }
            });
          }
        }

      });

  }

  onSignUp() {
    console.log('onSignUp');
  }

}
