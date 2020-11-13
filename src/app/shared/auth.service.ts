import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators'
import { UserInfo } from '../models/user-info';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: any
  public userId
  userEmail: string
  usersCollection: AngularFirestoreCollection<UserInfo>
  userProfile: Observable<UserInfo[]>

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
      this.userEmail = result.user.email
    }).then(() => {
      this.createUserProfile(this.userEmail)
    }).catch(error => {
      console.error(error.message)
    }).finally(() => {
      this.router.navigate(['home'])
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

  createUserProfile(email: string) {
    // CHECK IF USER PROFILE EXISTS
    this.usersCollection = this.afs.collection('users', ref => ref.where('email', '==', email))
    this.userProfile = this.usersCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as UserInfo

        return {
          userName: data.userName,
          email: data.email,
          photoUrl: data.photoUrl,
          friends: data.friends
        }
      })
    }))

    // IF !EXISTS CREATE USER PROFILE
    this.userProfile.subscribe(res => {
      if (res.length == 0) {
        console.log('not found')
        const data = {
          userName: this.user.displayName,
          email: this.user.email,
          photoUrl: this.user.photoURL,
          friends: []
        }

        this.afs.collection('users').doc(this.userId).set(data)
        // ADD TOASTR SUCCESS
      } else {
        // ADD TOASTR SUCCESS
        console.log('found')
      }
    })
  }

}
