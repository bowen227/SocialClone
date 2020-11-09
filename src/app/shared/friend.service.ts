import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { ok } from 'assert';
import { AuthService } from './auth.service';
import { Friend } from '../models/friend';
import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  friendCollection: AngularFirestoreCollection

  constructor(private afs: AngularFirestore, private auth: AuthService) { 
    this.friendCollection = this.afs.collection('users', ref => ref)
  }

  public getFriendsList(id: string) {
    return this.friendCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        if (a.payload.doc.id == id) {
          // console.log("Found user doc")
          const data = a.payload.doc.data()
          return { ...data }
        } else {
          return ok('Not found')
        }
      })
    }))
  }

  public getUserInfoDoc(email: string) {
    console.log('getting documents')
    this.friendCollection.snapshotChanges().pipe(map(actions => {
      actions.map(a => {
        if (a.payload.doc.data().FieldValue('email') == email) {
          console.log(email)
        }
      })
    }))
  }

  public addFriend(id: string, data) {
    // if (this.getUserInfoDoc(id) != null) {
    //   return this.getUserInfoDoc(id).update({friendsList: firebase.default.firestore.FieldValue.arrayUnion(data)})
    // } else {
    //   return ok('Not Found')
    // }
  }

}
