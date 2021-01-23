import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
export class VideoCallComponent implements OnInit {

  //  Component variables
  conferenceLinks = []; //   store all conference links
  errorMessage = ""; // throw message
  headElements = ['Id', 'Options']; // table header options.
  cubiApi = "https://ems-api.cubi.app/api/admin/createConference";

  constructor(private http: HttpClient) { }

  
  ngOnInit() {
    // just auto generate a video link for now and open a tab.
  }

  //  This function is used to build a conference using jitsi/cubi ems API.
  buildConference() {
      
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Connection': 'Keep-Alive' };
    const body = 'conferenceId='+ this.makeId();
    this.http.post<any>(this.cubiApi, body, {headers}).subscribe(data => {

        this.conferenceLinks.push(data.data);
        console.log(this.conferenceLinks);
        error: error => {
          this.errorMessage = error.message;
          console.error('There was an error!', error);
      }
    });
  }

  //  This function is use to make a randomID for the conference. A random id is a generic id to generate the token which is then used
  //  to build the conference jwt token.
  makeId() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

}
