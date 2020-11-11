import { Component, OnInit } from '@angular/core';
import { FriendService } from '../shared/friend.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor( ) { }

  ngOnInit(): void {
  }

  friendDetails(email: string) {
    
  }

}
