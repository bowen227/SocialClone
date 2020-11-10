import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: any;
  public showMore: boolean = false;

  constructor(public auth: AuthService) {
    
   }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe((user) => {
      this.user = user
    })
  }

  signOut() {
    this.auth.signOut()
  }

  openMenu() {
    this.showMore = !this.showMore
  }

}
