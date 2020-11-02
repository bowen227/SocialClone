import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Post } from '../models/post';
import { AuthService } from '../shared/auth.service';
import { PostService } from '../shared/post.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  user: any
  userId;
  posts: Observable<Post[]>
  postPopup: boolean = false
  // postForm: FormGroup
  bodyText: string
  image: string = '//:0'
  public uploadPerc: Observable<number>;
  public dloadURL: Observable<string>;

  constructor(public postService: PostService,
              public auth: AuthService,
              private storage: AngularFireStorage,
              ) { }

  ngOnInit(): void {
    this.posts = this.postService.getPosts()

    this.auth.auth.authState.subscribe(u => {
      if (u !== null) {
        this.user = u
        this.userId = u.uid
      } else {
        this.user = null
      }
    })
  }

  // INITIALIZE POSTFORM
  // public initPostForm() {
  //   return this.postForm = this.fb.group({ body: '' })
  // }

  // CREATE NEW POST
  public createNewPost() {
    const data = {
      userId: this.userId,
      userName: this.user.displayName,
      userEmail: this.user.email,
      userImgUrl: this.user.photoURL,
      body: this.bodyText,
      postImg: this.image,
      likes: [],
      comments: [],
      rePost: [],
      postDate: new Date()
    }

    this.postService.createPost(data)
    this.bodyText = ''
    this.image = '//:0'
    this.uploadPerc = null
  }

  // IMAGE UPLOAD
  public upload(event) {
    const file = event.target.files[0]
    const path = `posts/${file.name}`
    if (file.type.split('/')[0] == 'audio') {
      this.image = null
    } else {
      const task = this.storage.upload(path, file)
      this.uploadPerc = task.percentageChanges()

      task.snapshotChanges().subscribe(() => {
        this.dloadURL = this.storage.ref(path).getDownloadURL()
        this.dloadURL.subscribe(url => this.image = url)
      })
    }
  }

}
