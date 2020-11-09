import { AngularFirestoreDocument } from '@angular/fire/firestore'
import { firestore } from 'firebase-tools'

export class UserInfo {
    userName: string
    email: string
    photoUrl: string
    friends: Array<object> | firestore.FieldValue
}
