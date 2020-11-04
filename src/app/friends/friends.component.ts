import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { FriendService } from '../shared/friend.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {
  friends: Observable<any[]>
  user: any
  userId

  constructor(public auth: AuthService,
              private fService: FriendService) { }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe(u => {
      this.user = u
      this.userId = u.uid
      this.friends = this.fService.getFriendsList(u.uid)
    })
  }

  // ADD NEW FRIEND
  public addFriend() {
    console.log("Add Friend")
  }

}
