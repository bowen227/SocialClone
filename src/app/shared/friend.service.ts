import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { ok } from 'assert';
import { AuthService } from './auth.service';
import { Friend } from '../models/friend';
import { UserInfo } from '../models/user-info';
import { Observable } from 'rxjs';
import { ActionSequence } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  userCollection: AngularFirestoreCollection

  constructor(private afs: AngularFirestore, private auth: AuthService) { 
    this.userCollection = this.afs.collection('users', ref => ref)
  }

  public getFriendsList(id: string) {
    return this.userCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          if (a.payload.doc.id == id) {
            // console.log("Found user doc")
            const data = a.payload.doc.data()
            return data.friends
          }
        })
      }
    ))
  }

  public searchUsers(email: string): any {
    const data = this.afs.firestore.collection('users').where('email', '==', email).get().then(
      (response) => {
        response.forEach(doc => {
          const newFriend = {
            name: doc.data().userName,
            email: doc.data().email,
            photo: doc.data().photoUrl
          }
          return newFriend
        })
      }
    )
  }

  public addFriend(newFriend: object, Uid: string) {
    // ADD NEWFRIEND OBJ TO DB BY DOC ID = UID

    // ADD TOASTR ALERT IF ADD OR ERROR
    console.log(newFriend)
  }

}
