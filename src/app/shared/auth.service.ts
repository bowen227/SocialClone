import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import * as firebase from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any = null;

  constructor(public auth: AngularFireAuth) { 
    this.auth.onAuthStateChanged((user) => {
      this.user = user
    })
  }

  signIn() {
    this.auth.signInWithPopup(new firebase.default.auth.GoogleAuthProvider()).then(() => {
      console.log(this.auth.authState)
    })
  }

  signOut() {
    this.auth.signOut().then(() => {
      console.log("Signed Out")
    })
  }
}
