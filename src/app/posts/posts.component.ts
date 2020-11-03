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
  bodyText: string
  image: string = '//:0'
  // showComments: boolean = false;
  index = null;
  newComment: string;
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
      userName: this.user.displayName,
      userId: this.userId,
      imgUrl: this.user.photoURL,
      comment: this.newComment,
      date: new Date()
    }
    this.postService.addComment(id, data)
    this.newComment = ''
  }

  // SHARE POST
  public sharePost(id: string, index: number) {
    // const post = this.postService.getPost(id)
    // post.snapshotChanges().subscribe(p => {
    //   const o = p.payload.data()
    //   const sPost = {
    //     userId: o.userId,
    //     userName: o.userName,
    //     userEmail: o.userEmail,
    //     userImgUrl: o.userImgUrl,
    //     body: o.body,
    //     postImg: o.postImg,
    //     likes: o.likes.length,
    //     comments: o.comments.length,
    //     rePost: o.rePost.length,
    //   }
    //   console.log(sPost as Post)
    // })
    const data = document.getElementById(index.toString())
    const cData = data.cloneNode(true)
    const canvasContainer = document.getElementById('sharedImg')
    const canvas = document.createElement('canvas')
    canvasContainer.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    ctx.fillText(cData.toString(),10,50)
  }

}
