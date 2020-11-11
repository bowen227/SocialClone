import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { FriendService } from '../shared/friend.service';
import { map } from 'rxjs/operators';
import { Friend } from '../models/friend';


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
              private fService: FriendService) {
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
      if (x[0].length == 0) {
        this.friends = null
      } else {
        this.friends = x[0]
      }
    })
  }

  // ADD NEW FRIEND
  public addFriend() {
    let exists:boolean
    
    // GET NEWFRIEND EMAIL
    const userEmail = window.prompt("Email")

    // CHECK TO SEE IF ALREADY A FRIEND
    for (const key in this.friends) {
      if (Object.prototype.hasOwnProperty.call(this.friends, key)) {
        const element = this.friends[key];
        if (element.email == userEmail) {
          exists = true
        }
      }
    }

    // IF FRIEND EXISTS ADD TOASTER WARN 'ALREADY FRIEND' ELSE ADD NEW FRIEND
    if (!exists) {
      console.log('Add new friend')
      // CHECK TO SEE IF USEREMAIL EXISTS IN APP USERS
      const userDetails = this.fService.searchUsers(userEmail)

      // IF USER EXISTS CREATE NEW FRIEND OBJECT
      // const newFriend = userDetails

      // PASS FRIEND OBJECT TO SERVICE
      console.log(userDetails)
      // this.fService.addFriend(userDetails, this.userId)
    } else {
      // ADD TOASTR ALERT
      console.log('Friend exists')
    }
  }

}
