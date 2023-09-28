import { Component } from '@angular/core';
import { IDiscountResponce } from 'src/app/shared/interface/common.interface';
import { DataService } from 'src/app/shared/services/data.service';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-discount',
  templateUrl: './admin-discount.component.html',
  styleUrls: ['./admin-discount.component.scss']
})
export class AdminDiscountComponent {
  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private storage: Storage
  ) { }
  ngOnInit(): void {
    this.initDiscountForm()
    this.getDiscount()
  }


  initDiscountForm(): void {
    this.discountForm = this.fb.group({
      date:[this.getCurrentDate()],
      name: [null, Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }


  public discountForm!: FormGroup;
  public discounts = this.dataService.discounts;
  public uploadPercent!: number;
  public discountId!: number;

  public isImgUploaded: boolean = false;
  
  public clickAddBtn: boolean = false;
  
  public isUpdatePressed: boolean = false;
 

  
  


  //отримує масив знижок з db.json
  getDiscount() {
    this.dataService.getAll().subscribe(data => {
      this.discounts = data;

    })
  }
  //створює нову знижку і надсилає її в db.json
  addDiscount() {
    this.dataService.create(this.discountForm.value).subscribe(() => {
      this.getDiscount();
      this.isImgUploaded = false;
      this.uploadPercent = 0;
      this.discountForm.reset();
    })
    
  }

  //видаляє конкретну знижку з db.json
  clickDeleteCurrentDiscount(discount: IDiscountResponce): void {
    if (confirm("are you sure")) {
      this.dataService.delete(discount.id).subscribe(() => {
        const task = ref(this.storage, discount.imagePath);
        deleteObject(task).then(() => {
          console.log('File deleted');
        })
        this.getDiscount();
      })
    }
  }

 
 

  //при натисканні витягує з db.json конкретну знижку і заповнює поля її значеннями
  clickUpdateCurrentDiscount(discount: IDiscountResponce): void {
    if (this.clickAddBtn === false) {
      this.clickAddBtn = true;
    }
    this.discountForm.patchValue({
      date:discount.date,
      name:discount.name,
      title:discount.title,
      description:discount.description,
      imagePath:discount.imagePath
    })
    this.discountId = discount.id
    this.isUpdatePressed = true;
    this.isImgUploaded = true;
  }






  updateDiscount() {
    
    this.dataService.update(this.discountForm.value, this.discountId).subscribe(() => {
      this.getDiscount();
      this.discountForm.reset();
      this.isUpdatePressed = false;
      this.isImgUploaded = false;
      this.uploadPercent = 0;
    })
  }


  showAddMenu(): void {
    this.clickAddBtn === true ? this.clickAddBtn = false : this.clickAddBtn = true;
  }
  

  upload(event: any): void {
    const file = event.target.files[0];
    console.log(file)
    this.uploaFile('images', file.name, file)
      .then(data => {
        this.discountForm.patchValue({
          imagePath: data
        });
        this.isImgUploaded = true;
      })
  }


  async uploaFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path)
        const task = uploadBytesResumable(storageRef, file)
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress
        });
        await task
        url = await getDownloadURL(storageRef)
      } catch (e: any) {
        console.error(e)
      }
    } else {
      console.log('wrong format')
    }
    return Promise.resolve(url)
  }

  deleteImage(): void {
    const task = ref(this.storage, this.valueByControl('imagePath'));
    console.log(task);
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.isImgUploaded = false;
      this.uploadPercent = 0;
      this.discountForm.patchValue({
        imagePath: null
      })
    })
  }
  valueByControl(control: string): string {
    return this.discountForm.get(control)?.value;
  }



  getCurrentDate(): string {
    const date = new Date()
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let currentDate = [hours, ':', minutes, ', ', day, '.', month, '.', year];
    return currentDate.join('');
  }


}
