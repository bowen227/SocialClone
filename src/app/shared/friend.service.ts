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
  // userRef:any

  constructor(private afs: AngularFirestore, private auth: AuthService) { 
    this.userCollection = this.afs.collection('users', ref => ref)
    // this.userRef = this.afs.collection('users').ref
  }

  public getFriendsList(id: string) {
    return this.userCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          if (a.payload.doc.id == id) {
            // console.log("Found user doc")
            const data = a.payload.doc.data()
            // console.log(data)
            return data.friends
          }
        })
      }
    ))
  }

  public async searchUsers(email: string) {
    // GET USER BY EMAIL
    const userDetails = this.afs.firestore.collection('users').where('email', '==', email)
    let details
    const doc = await userDetails.get()

    // IF NOT EMPTY CREATE OBJ
    if (!doc.empty) {
      console.log('Doc not empty')
      doc.docs.map(x => {
        const d = {
          userName: x.data().userName,
          userEmail: x.data().email,
          photoUrl: x.data().photoUrl,
          userId: x.id
        }
        details = d
      })
    } else {
      console.log('No Document')
    }
    // ADD OBJ TO LOCALSTORAGE RETURN OBJ
    localStorage.setItem('searchedUser', JSON.stringify(details))
    console.log('Set in localstorage')
    return details
    
  }

  public addFriend(newFriend: object, Uid: string) {
    // ADD NEWFRIEND OBJ TO DB BY DOC ID = UID
    const userRef = this.userCollection.doc(Uid)
    userRef.update({
      friends: firebase.default.firestore.FieldValue.arrayUnion(newFriend)
    })

    localStorage.removeItem('searchedUser')

    // ADD TOASTR ALERT IF ADD OR ERROR
  }

}
