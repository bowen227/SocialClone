import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

// FIREBASE IMPORTS
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from '../environments/environment';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PostsComponent } from './posts/posts.component';
import { FriendsComponent } from './friends/friends.component';
import { MessagesComponent } from './messages/messages.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PostsComponent,
    FriendsComponent,
    MessagesComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
