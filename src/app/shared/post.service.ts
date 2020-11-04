import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postCollection: AngularFirestoreCollection
  post: AngularFirestoreDocument<Post>
  authState: any = null

  constructor(private afs: AngularFirestore, public auth: AngularFireAuth) {
    this.postCollection = this.afs.collection('posts', ref => 
    ref.orderBy('postDate', 'desc'))

    this.auth.authState.subscribe(data => this.authState = data)
   }

   public getPosts() {
     return this.postCollection.snapshotChanges().pipe(map(actions => {
       return actions.map(a => {
         const data = a.payload.doc.data() as Post
         const id = a.payload.doc.id
         return { id, ...data }
       })
     }))
   }

   public getPost(id: string) {
     return this.afs.doc<Post>(`posts/${id}`)
   }

   public getData(id: string) {
     this.post = this.afs.doc<Post>(`posts/${id}`)
     return this.post.valueChanges();
   }

   public createPost(data) {
     this.postCollection.add(data)
   }

   public deletePost(id: string) {
     return this.getPost(id).delete()
   }

   public updatePost(id: string, data) {
     return this.getPost(id).update(data);
   }

   public likePost(id: string, user: string) {
     return this.getPost(id).update({likes: firebase.default.firestore.FieldValue.arrayUnion(user)})
   }

   public removeLike(id: string, user: string) {
     return this.getPost(id).update({likes: firebase.default.firestore.FieldValue.arrayRemove(user)})
   }

   public addComment(id: string, data) {
     return this.getPost(id).update({comments: firebase.default.firestore.FieldValue.arrayUnion(data)})
   }

}
