import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: any = null;
  public showMore: boolean = false;

  constructor(public auth: AuthService) {
    
   }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe((user) => {
      this.user = user
    })
  }

  signIn() {
    this.auth.signIn()
  }

  signOut() {
    this.auth.signOut()
  }

  openMenu() {
    this.showMore = !this.showMore
  }

}
