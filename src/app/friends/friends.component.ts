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
  friends: object[]
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
      x.map(f => {
        console.log(f)
      })
    })
  }

  // ADD NEW FRIEND
  public addFriend() {
    this.fService.addFriend(this.user.email)
  }

}
