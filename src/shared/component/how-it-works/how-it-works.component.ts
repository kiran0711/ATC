import { Component, OnInit } from '@angular/core';
import * as CONSTANTS from 'src/app/app.constants';
import { SharedService } from 'src/shared/service/shared.service';
import { ActivatedRoute, NavigationExtras, Router,Params } from '@angular/router';
declare var $: any 

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.css']
})
export class HowItWorksComponent implements OnInit {

  title = 'How It Works';
  constructor(
    private sharedService:SharedService,
    private router: Router) {

     }

  myVideo = document.getElementById("video1");
  videoPlayer: HTMLVideoElement;
  ngOnInit(): void {
  }
  
  play(){
  // this.myVideo?.onplay();
    this.videoPlayer.play();
  }

  get user(){
    let userStr = localStorage.getItem('userdata') || '{}';
    return JSON.parse(userStr);
  }

  navigate(){
    if(this.user && (this.user.user_type==CONSTANTS.USER_TYPE.HOST || this.user.user_type==CONSTANTS.USER_TYPE.GUEST_AND_HOST)){
      if(this.role==CONSTANTS.GUEST){
        //jQuery\.noConflict\(\);
        $('#continue_to_host').modal('show');
      }else{
        this.router.navigateByUrl('/host/property-listing/title')
      }
    }else if(this.user.user_type){
      this.sharedService.changeRegTypeOrRegister.next({ loginStatus: true })
    }else{
      this.sharedService.openRegisterPopup.next({ loginStatus: false,userType:2 })
    }
  }

  ChangeRegistrationType(){
    this.sharedService.changeRegTypeOrRegister.next('host')
    this.router.navigateByUrl('/host/property-listing/title')
  }

  get role() {
    let r = localStorage.getItem(CONSTANTS.ROLE);
    r = r || '';
    return r;
  }
}
