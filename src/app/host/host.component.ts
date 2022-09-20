import { Component, OnInit } from '@angular/core';
declare let $: any;

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css'],
})
export class HostComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    //jQuery\.noConflict\(\);
    $('.leftSidebar, .rightSidebar').theiaStickySidebar({
      additionalMarginTop: 100,
    });
  }
}
