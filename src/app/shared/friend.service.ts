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
  userCollection: AngularFirestoreCollection

  constructor(private afs: AngularFirestore, private auth: AuthService) { 
    this.userCollection = this.afs.collection('users', ref => ref)
  }

  public getFriendsList(id: string) {
    return this.userCollection.snapshotChanges().pipe(map(actions => {
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

  public addFriend(email: string) {
    const usersRef = this.afs.collection('users', ref => ref.where('email', '==', 'testperson@email.com'))
    console.log(usersRef.ref.get())
  }

}
