import { animation } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase'
import { map } from 'rxjs/operators'
import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any = null
  public userId
  public friendCollection: AngularFirestoreCollection

  constructor(public auth: AngularFireAuth, private afs: AngularFirestore) {
    this.auth.onAuthStateChanged((user) => {
      this.user = user
      if (user != null) {
        this.userId = user.uid
      }
    }).then(
      () => {
        // console.log('Getting friends')
        this.friendCollection = this.afs.collection('users', ref => ref)
      }).catch(
      (error) => {
        console.log(error)
      }
    )
  }

  signIn() {
    this.auth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then(() => {
      console.log('Signed In')
      this.createUserProfile()
    })
  }

  signOut() {
    this.auth.signOut().then(() => {
      console.log("Signed Out")
    })
  }

  getUserInfoDoc() {
    this.afs.doc(`users/${this.userId}`).snapshotChanges().subscribe(x => {
      return x.payload.exists
    })
  }

  createUserProfile() {
    // console.log('create profile')
    const userRef = this.getUserInfoDoc()
    console.log(userRef)
    if (userRef == null) {
      // console.log('Adding user to DB')
      const data = {
        userName: this.user.displayName,
        email: this.user.email,
        photoUrl: this.user.photoURL,
        friends: []
      }
      // console.log(data)
      this.afs.collection('users').doc(this.userId).set(data)
    } else {
      console.log('User already in DB')
    }
  }

}
