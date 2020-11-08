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
  friendList: Array<any>
  user: any
  userId

  constructor(public auth: AuthService,
              private fService: FriendService) {
                this.auth.auth.authState.subscribe(u => {
                  this.user = u
                  this.userId = u.uid
                  console.log(u.uid)
                  console.log(u.displayName)
                  console.log(u.email)
                  console.log(u.photoURL)
                  this.friends = this.fService.getFriendsList(u.uid)
                })
               }

  ngOnInit(): void {
    
  }

  // ADD NEW FRIEND
  public addFriend() {
    this.auth.getUserByEmail(this.user.email)
  }

}
