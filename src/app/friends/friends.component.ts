import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { FriendService } from '../shared/friend.service';
import { map } from 'rxjs/operators';
import { Friend } from '../models/friend';
import { Router } from '@angular/router';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  userInfo: Observable<any[]>
  friends
  user: any
  userId

  constructor(public auth: AuthService,
              private fService: FriendService,
              private router: Router) {
    this.auth.auth.authState.subscribe(u => {
      this.user = u
      if (u != null) {
        this.userId = u.uid
        // console.log(u.uid)
        this.userInfo = this.fService.getFriendsList(u.uid)
        this.sortFriends()
      }
    })
  }

  ngOnInit(): void {  }

  // SORT FRIENDS LIST
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

  // ADD NEW FRIEND
  public addFriend() {
    let exists:boolean
    
    // GET NEWFRIEND EMAIL
    const userEmail = window.prompt("Email")

    // CHECK IF USEREMAIL
    if (userEmail !== null) {
      // CHECK TO SEE IF ALREADY A FRIEND
      for (const key in this.friends) {
        if (Object.prototype.hasOwnProperty.call(this.friends, key)) {
          const element = this.friends[key];
          if (element.email == userEmail.toLowerCase()) {
            exists = true
          }
        }
      }
      // IF FRIEND !EXISTS ADD NEW FRIEND
      if (!exists) {
        // console.log('Add new friend')
        // CHECK TO SEE IF USEREMAIL EXISTS IN DB 'USERS'
        this.fService.searchUsers(userEmail.toLowerCase()).then(
          data => data
        )

        const userDetails = JSON.parse(localStorage.getItem('searchedUser'))

        // PASS FRIEND OBJECT TO SERVICE
        this.fService.addFriend(userDetails, this.userId)
      } else {
        // ADD TOASTR ALERT
        console.log('Friend exists')
      }
    }
  }

}
