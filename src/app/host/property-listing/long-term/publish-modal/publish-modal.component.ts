import { Component, EventEmitter, OnInit, Output } from '@angular/core';
declare var $: any 

@Component({
  selector: 'property-long-term-publish-modal',
  templateUrl: './publish-modal.component.html',
  styleUrls: ['./publish-modal.component.css']
})
export class PublishModalComponent implements OnInit {

  agreed:any=false
  @Output() emitter: EventEmitter<any> = new EventEmitter();

  constructor(){

  }

  ngOnInit() {
  }

  submit(){
    $('#additional_details_longterm').modal('hide');
    this.emitter.emit(this.agreed)
  }
}
