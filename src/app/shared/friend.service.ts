import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  friendCollection: AngularFirestoreCollection
  friendList: AngularFirestoreDocument<any>

  constructor(private afs: AngularFirestore) { 
    this.friendCollection = this.afs.collection('friends', ref => ref)
  }

  public getFriendsList(id: string) {
    return this.friendCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        if (a.payload.doc.id === id) {
          console.log("They matched!!!")
          const data = a.payload.doc.data()
          const id = a.payload.doc.id
          return { id, ...data }
        } else {
          return null
        }
      })
    }))
  }

  public getFriendDoc(id: string) {
    return this.friendList = this.afs.doc<any>(`friendsList/${id}`)
  }

  // public getFriendsList(id: string) {
  //   this.friendList = this.afs.doc<any>(`friendsList/${id}`)
  //   return this.friendList.valueChanges()
  // }

}
