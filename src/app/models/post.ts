import { AngularFirestoreDocument } from '@angular/fire/firestore'
import { firestore } from 'firebase-tools'

export class Post {
    id: string
    userId: string
    userName: string
    userEmail: string
    userImgUrl: string
    body: string
    postImg: string
    likes: Array<string> | firestore.FieldValue
    comments: Array<object> | firestore.FieldValue
    rePost: Array<string> | firestore.FieldValue
    date: string
}
