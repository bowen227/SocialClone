import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { FriendService } from '../shared/friend.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public user: any
  public userId: string
  public showMore: boolean = false
  public userInfo: Observable<any[]>
  public friends
  public showFriends: boolean = false

  constructor(public auth: AuthService,
              private fService: FriendService) {
      this.auth.auth.authState.subscribe((user) => {
        if (user != null) {
          this.user = user
          this.userId = user.uid
          this.userInfo = this.fService.getFriendsList(this.userId)
          this.sortFriends()
        }
      })
    }

  ngOnInit(): void {
    
  }

  signOut() {
    this.auth.signOut()
  }

  openMenu() {
    this.showMore = !this.showMore
  }

  goToProfile() {
    console.log('go to profile')
  }

  toggleFriends() {
    this.showFriends = !this.showFriends
  }

  sortFriends() {
    this.userInfo.subscribe(x => {
      // console.log(x)
      for (const key in x) {
        if (Object.prototype.hasOwnProperty.call(x, key)) {
          const element = x[key];
          if (Object.prototype.toString.call(element).indexOf('Array')>-1) {
            if (element.length == 0) {
              this.friends = null
            } else {
              this.friends = element
            }
          }
        }
      }
    })
  }

}
