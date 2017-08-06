/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';
import { AuthService } from './shared/services/auth.service';

import { ChatModule } from './chat';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../sass/main.scss'
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./todo'] ">
          Todo
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./admin'] ">
          Admin
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./login'] ">
          Login
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./register'] ">
          Register
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <!--<vu-chat></vu-chat>-->

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>{{ name }} by <a [href]="url">{{ author }}</a></span>
      <div>
        <a [href]="url">
          <img [src]="appLogo" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class AppComponent {
  public appLogo = 'assets/img/author-logo.gif';
  public author = '@datatype_void'
  public name = 'Angular 2 MEAN Webpack Starter';
  public url = 'https://twitter.com/datatype_void';

  constructor(private appState: AppState, private authService: AuthService) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * For help or questions please contact me at @datatype_void on twitter
 * or our chat on Slack at http://www.davidniciforovic.com/wp-login.php?action=slack-invitation
 */
