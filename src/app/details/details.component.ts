import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsService } from '../shared/details.service';
import { Location } from '@angular/common'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  userId: string
  userDetails: any

  constructor(private route: ActivatedRoute,
              public router: Router,
              private dService: DetailsService,
              private location: Location) { }

  ngOnInit(): void {
    this.getUserIdFromRoute()

    this.getUserDetails()
  }

  // GET USERID FROM ROUTE
  getUserIdFromRoute() {
    this.userId = this.route.snapshot.paramMap.get('id')
  }

  // GET USER DETAILS
  getUserDetails() {
    this.dService.getDetails(this.userId).subscribe(res => {
      this.userDetails = res.payload.data()
    })
  }

  // GET USER POSTS

  // GET USER FRIENDS

  goBack(): void {
    this.location.back()
  }

}
