import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsService } from '../shared/details.service';
import { Location } from '@angular/common'
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { PostService } from '../shared/post.service';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  loggedInUser: any
  loggedInUserId: string
  userId: string
  userDetails: any
  friends = []
  posts = []
  userPosts: Observable<Post[]>
  index = null;
  newComment: string;

  constructor(private route: ActivatedRoute,
              public router: Router,
              public auth: AuthService,
              private dService: DetailsService,
              private location: Location,
              private postService: PostService) { }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe(u => {
      if (u !== null) {
        this.loggedInUser = u
        this.loggedInUserId = u.uid
      } else {
        this.loggedInUser = null
      }
    })

    this.getUserIdFromRoute()

    this.getUserDetails()

    this.getUserPosts()

    this.scrollToTop()
    
  }

  // GET USERID FROM ROUTE
  getUserIdFromRoute() {
    this.userId = this.route.snapshot.paramMap.get('id')
  }

  // GET USER DETAILS
  getUserDetails() {
    this.dService.getDetails(this.userId).subscribe(res => {
      this.userDetails = res.payload.data()
      this.userId = res.payload.id
      if (this.userDetails) {
        for (const key in this.userDetails) {
          if (Object.prototype.hasOwnProperty.call(this.userDetails, key)) {
            const element = this.userDetails[key];
            if (Object.prototype.toString.call(element).indexOf('Array')>-1) {
              element.forEach(item => {
                // this.friends.push(item)
                if (item == null) {
                  console.log('null')
                } else {
                  this.friends.push(item)
                }
              });
            }
          }
        }
      }
    })
  }

  // GET USER POSTS
  getUserPosts() {
    if (this.userId) {
      this.userPosts = this.postService.getPostsByUserId(this.userId)

      this.userPosts.subscribe(res => {
        for (const key in res) {
          if (Object.prototype.hasOwnProperty.call(res, key)) {
            const element = res[key];
            if (element) {
              this.posts.push(element)
            }
          }
        }
      })
    }
  }

  // GET USER FRIENDS

  goBack(): void {
    this.location.back()
  }

  // LIKE POST
  public likePost(id: string) {
    this.postService.likePost(id, this.userId)
  }

  // UNLIKE POST
  public unlikePost(id: string) {
    this.postService.removeLike(id, this.userId)
  }

  // SHOW COMMENTS
  public showComment(index: number) {
    if (this.index == null) {
      this.index = index
    } else {
      this.index = null
    }
  }

  // SAVE COMMENT
  public saveComment(id: string) {
    const data = {
      userName: this.loggedInUser.displayName,
      userId: this.loggedInUserId,
      imgUrl: this.loggedInUser.photoURL,
      comment: this.newComment,
      date: new Date()
    }
    this.postService.addComment(id, data)
    this.newComment = ''
  }

  public scrollToTop() {
    window.scroll(0, 0);
  }

}
