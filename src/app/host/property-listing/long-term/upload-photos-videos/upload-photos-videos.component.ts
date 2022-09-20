import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/shared/service/api.service';
import { SharedService } from 'src/shared/service/shared.service';
import { ApiEndpoints } from 'src/shared/utils/api-url';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { LongTermPropertyService } from '../long-term-property-listing.service';

@Component({
  selector: 'app-upload-photos-videos',
  templateUrl: './upload-photos-videos.component.html',
  styleUrls: ['./upload-photos-videos.component.css']
})
export class UploadPhotosVideosComponent implements OnInit {
  dragAreaClass: string = "dragBox";
  error: string = "";
  sessions: Array<Subscription> = []
  files: Array<any> = []
  images: any = []
  imageUrl: any
  step = 1
  imageSaveRequest = {
    pro_id: null,
    user_id: null,
    pro_img_id: [] as Array<any>,
    caption: [] as Array<any>,
    is_primary: null
  }
  saveNExit: boolean;
  maxFileSize = 200 * 1024 * 1024
  currentFileSize = 0
  videoCount = 0
  pro_id: any
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sharedService: SharedService,
    private location: Location,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    public proListingService: LongTermPropertyService,
    private propertyListingService: LongTermPropertyService,
  ) { }

  async ngOnInit() {
    this.pro_id = this.route.snapshot.queryParamMap.get('proId');
    if (this.pro_id) {
      await this.proListingService.getpropertyById(this.pro_id);
      if (!this.proListingService.getStepThree()) {
        this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_FOUR + "?proId=" + this.pro_id);
        return
      }
    }
    else {
      this.router.navigateByUrl(this.proListingService.CREATE_PROPERTY_STEP_ONE);
      return;
    }

    let property: any = this.proListingService.property;
    this.images = property.step_four
    this.imageUrl = environment.imageURL + 'storage/';
    this.selectPrimary()

  }

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "dragBoxHover";
    event.preventDefault();
  }

  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragBox";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      let files: FileList = event.dataTransfer.files;
      this.saveFiles(files);
    }
  }

  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "dragBoxHover";
    event.preventDefault();
  }

  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragBox";
    event.preventDefault();
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragBox";
    event.preventDefault();
  }

  dragNdrop(event: any) {
    let files: FileList = event.target.files;
    this.saveFiles(files);
  }

  readURL(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      let imageSrc = e.target.result;
      this.uploadFile(imageSrc, file)
    };

    reader.readAsDataURL(file);
  }

  saveFiles(files: FileList) {
    let videoCount = 0
    if (files) {
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if (files[index].type.includes("video")) {
          videoCount++;
        }
      }

    }
    if (files.length < 1) {
      return
    } else if (files.length + this.images.length > 20) {
      this.error = "Max 20 file can be upload.";
      return
    } else if ((this.currentFileSize + files[0].size) >= this.maxFileSize) {
      this.error = "Max limit of file reached";
      return
    }
    else if ((this.videoCount + videoCount) > 1) {
      this.error = "Only one video is allowed";
      return
    }
    else if (!(files[0].type.toLowerCase().includes("jpg")
      || files[0].type.toLowerCase().includes("jpeg")
      || files[0].type.toLowerCase().includes("png")
      || files[0].type.toLowerCase().includes("bmp")
      || files[0].type.toLowerCase().includes("jpeg")
      || files[0].type.toLowerCase().includes("mp4")
      || files[0].type.toLowerCase().includes("avi"))) {
      this.error = "File type not supported";
      return
    }
    else {
      this.error = "";
      console.log(files.length && files[0].size, files[0].name, files[0].type);
    }
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      this.readURL(files[index])
    }

  }

  uploadFile(imageUrl: string, file: File) {
    const formData = new FormData();
    formData.append('pro_img_video', file, file.name);
    formData.append('user_id', this.sharedService.getUserDetails().user_id);
    formData.append('pro_id', this.proListingService.getCurrentPropertyId() as any);
    this.currentFileSize += file.size
    if (file.type.includes("video")) {
      this.videoCount++
    }
    let options = {
      reportProgress: true,
      observe: 'events'
    }
    let uploadSession = this.apiService.uploadImage(
      environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP_IMAGE_UPLOAD,
      formData,
      options,
      file
    ).subscribe(resp => {

      if (resp.type === HttpEventType.Response) {
        // console.log('Upload complete');
        console.log(resp)
        this.proListingService.property = resp.body.data
        this.images = resp.body.data.step_four
        this.selectPrimary()
        if (this.files.length) {
          let file = this.files.find(x => x.file.name == resp.file_name);
          let index = this.files.indexOf(file)
          console.log(this.sessions.length)
          console.log(index)
          this.sessions.splice(index, 1)
          this.files = this.files.filter(x => x.file.name != resp.file_name);
        }

      }
      if (resp.type === HttpEventType.UploadProgress) {

        const percentDone = Math.round(100 * resp.loaded / resp.total);
        // console.log('Progress ' + percentDone + '%');
        if (this.files.length) {
          let file = this.files.find(x => x.file.name == resp.file_name);
          file.progress = percentDone
        }
        // uploadData.progress=percentDone
      }
    }, (error: any) => {
      if (this.files.length) {
        let file = this.files.find(x => x.file.name == error.data.file_name);
        file.error = error.message
      }
    });

    this.files.push({ "image_url": imageUrl, "progress": 0, "file": file })
    this.sessions.push(uploadSession)
  }

  getImageSize(size: any): string {
    return Math.round(size / 1024) + "kb"
  }

  stopUpload(index: any) {
    this.sessions[index].unsubscribe()
    this.sessions.splice(index, 1)
    if (this.files[index].file.type.includes("video")) {
      this.videoCount--
    }
    this.currentFileSize -= this.files[index].file.size
    this.files.splice(index, 1)
  }

  onChange(event: any) {
    console.log(event)
    this.imageSaveRequest.is_primary = event.pro_img_id;
  }

  get isValidStep1() {
    let imageLength = this.images.filter((file: any) => file.file_type == "image")
    return imageLength.length >= 2
  }

  get isValidStep2() {
    let isvalid = true
    if (!this.imageSaveRequest.is_primary) {
      isvalid = false
    }
    // this.images.forEach((element:any) => {
    //   if(!element.image_caption){
    //     isvalid=false
    //   }
    // });
    return isvalid
  }

  selectPrimary() {
    let firstImageId: any
    this.imageSaveRequest.is_primary = null
    this.images.forEach((element: any) => {
      if (element.is_primary) {
        this.imageSaveRequest.is_primary = this.images[0].is_primary
      }
      if (!firstImageId && element.file_type == 'image') {
        firstImageId = element.pro_img_id
      }
    });
    if (!this.imageSaveRequest.is_primary) {
      this.imageSaveRequest.is_primary = firstImageId
      this.images.forEach((element: any) => {
        if (element.pro_img_id == firstImageId) {
          element.is_primary = 1
        }
      });
    }

    this.videoCount = 0
    this.error = "";
    this.currentFileSize = 0
    this.images.forEach((element: any) => {
      this.currentFileSize += (element.file_size * 1000 * 1000)
      if (element.file_type == 'video') {
        this.videoCount++
      }
    });
  }

  saveAndExit() {
    this.saveNExit = true;
    this.saveImageAndProceed();
  }

  removeImage(index: any) {
    let requestBody: any = {}
    requestBody.pro_img_id = this.images[index].pro_img_id

    // requestBody.user_id=this.sharedService.getUserDetails().user_id
    // requestBody.pro_id=this.sharedService.propertyId
    // requestBody.is_primary=this.sharedService.propertyId
    const formData = new FormData();
    formData.append('pro_img_id', this.images[index].pro_img_id);
    formData.append('user_id', this.sharedService.getUserDetails().user_id);
    this.apiService
      .post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_IMAGE_DELETE, formData)
      .subscribe((data: any) => {
        if (this.images[index].is_primary) {
          this.imageSaveRequest.is_primary = null
        }
        if (this.checkFileType(this.images[index].image) == 1) {
          this.videoCount--
          console.log(this.videoCount)
        }
        this.images.splice(index, 1)
        if (this.images.length <= 0) {
          this.step = 1
        }
      });


  }

  checkFileType(url: string): any {
    if (url.toLowerCase().endsWith(".jpg")
      || url.toLowerCase().endsWith(".jpeg")
      || url.toLowerCase().endsWith(".png")
      || url.toLowerCase().endsWith(".bmp")
      || url.toLowerCase().endsWith(".jpeg")) {
      return 0
    } else {
      return 1
    }
  }

  async saveImageAndProceed() {
    // if(!this.proListingService.property.step_zero.pro_slug){
    //   let resp:any = await this.apiService.postSync(environment.baseURL + ApiEndpoints.PROPERTY_EDIT_STEP0, {pro_id: this.sharedService.propertyId});
    //   this.sharedService.proSlug=resp.data.pro_slug
    // }

    this.imageSaveRequest.pro_id = this.proListingService.getCurrentPropertyId();
    // this.imageSaveRequest.pro_id = 8;
    this.imageSaveRequest.user_id = this.sharedService.getUserDetails().user_id;
    this.imageSaveRequest.caption = []
    this.imageSaveRequest.pro_img_id = []
    this.images.forEach((element: any) => {
      this.imageSaveRequest.caption.push(element.image_caption ? element.image_caption : "")
      this.imageSaveRequest.pro_img_id.push(element.pro_img_id)
    });

    console.log(this.imageSaveRequest);

    this.apiService
      .post(environment.baseURL + ApiEndpoints.longTermProperty.PROPERTY_STEP_IMAGE_UPDATE, this.imageSaveRequest)
      .subscribe((data: any) => {
        console.log('data', data);
        if (this.saveNExit) {
          this.sharedService.propertyId = null
        }
        this.router.navigateByUrl(this.saveNExit ? "host/property-list" : '/host/property-listing/long-term/leasing-details?proId=' + this.proListingService.getCurrentPropertyId());
      });

  }

  goBack() {
    if (this.step == 2) {
      this.step = 1
    } else {
      this.location.back();
    }

  }



  // loadImages(step:any){
  //   let reqBody = {
  //     pro_id: this.proListingService.getCurrentPropertyId(),
  //     // pro_id: 8,
  //   };
  //   console.log(reqBody);
  //   this.apiService
  //     .post(environment.baseURL + ApiEndpoints.PROPERTY_IMAGE_LIST, reqBody)
  //     .subscribe((data: any) => {
  //       console.log('data', data);
  //       this.images=data.data
  //       this.files=[]
  //       this.imageSaveRequest.is_primary=null
  //       this.images.forEach((element:any) => {
  //         if(element.is_primary){
  //           this.imageSaveRequest.is_primary=this.images[0].is_primary
  //         }
  //       });
  //       if(!this.imageSaveRequest.is_primary){
  //         this.imageSaveRequest.is_primary=this.images[0].pro_img_id
  //         this.images[0].is_primary=1
  //       }

  //       this.videoCount=0
  //       this.error = "";
  //       this.currentFileSize=0
  //       this.images.forEach((element:any) => {
  //         this.currentFileSize+=(element.file_size*1000*1000)
  //         if(this.checkFileType(element.image)==1){
  //           this.videoCount++
  //         }
  //       });
  //       this.step=step
  //     }); 
  // }



}
