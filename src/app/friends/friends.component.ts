import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { PostService } from '../shared/post.service';

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
              private postService: PostService) { }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe(u => {
      if ( u !== null) {
        this.user = u
        this.userId = u.uid
        // this.friends = this.postService.getFriends(u.uid)
        console.log(this.friends)
      } else {
        this.user = null
      }
    })
  }

  // ADD NEW FRIEND
  public addFriend() {

  }

}
