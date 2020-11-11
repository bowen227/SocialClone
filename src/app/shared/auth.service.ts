import { animation } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import * as firebase from 'firebase'
import { map } from 'rxjs/operators'
import { UserInfo } from '../models/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any
  public userId

  constructor(
    public auth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore
    ) {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.user = user
        this.userId = user.uid
        localStorage.setItem('user', JSON.stringify(this.user))
        JSON.parse(localStorage.getItem('user'))
      } else {
        localStorage.setItem('user', null)
        JSON.parse(localStorage.getItem('user'))
      }
    })
  }

  // CHECK IF SIGNED IN
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'))
    return (user !== null) ? true : false
  }

  signIn() {
    this.auth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then((result) => {
      this.createUserProfile()
    }).then(() => {
      this.router.navigate(['home'])
    }).catch(error => {
      console.log(error)
    })
  }

  signOut() {
    this.auth.signOut().then(() => {
      console.log("Signed Out")
    }).then(() => {
      this.router.navigate([''])
      localStorage.removeItem('user')
    })
  }

  checkIfUserDocExists():boolean {
    // CHECK IF USER EXISTS IN DB
    const exists = this.afs.doc(`users/${this.userId}`).snapshotChanges().subscribe(x => {
      x.payload.exists
    })

    if (exists) {
      return true
    } else {
      return false
    }
  }

  createUserProfile() {
    // GET USER REF
    const userRef = this.checkIfUserDocExists()
    // console.log(userRef)

    // CHECK IF EXISTS
    if (!userRef) {
      // CREATE USER OBJ
      const data = {
        userName: this.user.displayName,
        email: this.user.email,
        photoUrl: this.user.photoURL,
        friends: []
      }
      // ADD TO DB
      this.afs.collection('users').doc(this.userId).set(data)
    } else {
      console.log('User already in DB')
    }
  }

}
