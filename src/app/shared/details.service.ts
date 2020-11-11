import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
  userId: string
  userDetails: Observable<any[]>

  constructor(public afs: AngularFirestore,
              private router: Router,
              private route: ActivatedRoute) { }

  getDetails(id: string) {
    return this.afs.collection('users').doc(id).snapshotChanges()
  }
}
