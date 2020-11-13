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

  addConnection() {
    let exists: boolean

    // GET NEWFRIEND EMAIL
    const userEmail: string = window.prompt("Enter user email")

    // CHECK IF USEREMAIL
    if (userEmail !== null) {
      // CHECK TO SEE IF CONNECTION ALREADY EXISTS
      for (const key in this.friends) {
        if (Object.prototype.hasOwnProperty.call(this.friends, key)) {
          const element = this.friends[key];
          if (element.email == userEmail.toLowerCase()) {
            exists = true
          }
        }
      }
      // IF CONNECTION !EXISTS CREATE CONNECTION OBJ
      if (!exists) {
        this.fService.searchUsers(userEmail.toLowerCase()).then(
          data => data
        )

        const userDetails = JSON.parse(localStorage.getItem('searchedUser'))

        // PASS CONNECTION OBJ TO SERVICE
        // ADD TOASTR ALERT
        this.fService.addFriend(userDetails, this.userId)
      } else {
        // ADD TOASTR ALERT
        console.error('Connection exists')
      }
    }

    // IF CONNECTION !EXISTS ADD NEW CONNECTION

  }

}
