import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

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

        this.userService.checkAccessToken();

        if (this.userService.accessTokenExists) {
          console.log('accessTokenExists: ', this.userService.accessTokenExists);
          if (routePath === 'SignUp') {
            return;
          }
          if (!this.userService.currentUser) {
            this.userService.checkWallet().then(() => {
              if (!this.userService.currentUser) {
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
