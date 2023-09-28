import { Component } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProductResponce } from 'src/app/shared/interface/common.interface';
import { ICategoryResponce } from 'src/app/shared/interface/common.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';
import { ProductService } from 'src/app/shared/services/product/product.service';


@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent {
  constructor(
    private productService: ProductService,
    private categoryService:CategoryService,
    private fb: FormBuilder,
    private storage: Storage
  ) { }
  ngOnInit(): void {
    this.initProductForm()
    this.getCategories()
    this.getProduct()
  }


  initProductForm(): void {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      category: [this.currentCategoryID, Validators.required],
      path: [null, Validators.required],
      ingredients: [null, Validators.required],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      imagePath:[null,Validators.required],
      count:[1]
    })
  }


  

  public productForm!: FormGroup;
  public products = this.productService.products;
  public categories = this.categoryService.categories;
  public uploadPercent!: number;
  public productID!: number;
  public currentCategoryID:number = 0;

  public isImgUploaded: boolean = false;

  public clickAddBtn: boolean = false;

  public isUpdatePressed: boolean = false;




  //отримує масив знижок з db.json
  getProduct() {
    this.productService.getAll().subscribe(data => {
      this.products = data;
    })
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data
      this.productForm.patchValue({
        category:this.categories[0].id
      })
    })
  }
  //створює нову знижку і надсилає її в db.json
  addProduct() {
    console.log(this.productForm.value)
    this.productService.create(this.productForm.value).subscribe(() => {
      this.getProduct();
      this.isImgUploaded = false;
      this.uploadPercent = 0;
      this.productForm.reset();
    })

  }

  //видаляє конкретну знижку з db.json
  clickDeleteCurrent(product: IProductResponce): void {
    if (confirm("are you sure")) {
      this.productService.delete(product.id).subscribe(() => {
        const task = ref(this.storage, product.imagePath);
        deleteObject(task).then(() => {
          console.log('File deleted');
        })
        this.getProduct();
      })
    }
  }




  //при натисканні витягує з db.json конкретну знижку і заповнює поля її значеннями
  clickUpdateCurrent(product: IProductResponce): void {
    if (this.clickAddBtn === false) {
      this.clickAddBtn = true;
    }
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      path: product.path,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      imagePath:product.imagePath,
      count:1
    })
    this.productID = product.id;
    this.isUpdatePressed = true;
    this.isImgUploaded = true;
  }



  changeCategory(categoryElem:any):void{
    this.currentCategoryID = categoryElem.value;
    console.log(categoryElem.value)
  }


  updateProduct() {
    this.productService.update(this.productForm.value, this.productID).subscribe(() => {
      this.getProduct();
      this.productForm.reset();
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
        this.productForm.patchValue({
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
      this.productForm.patchValue({
        imagePath: null
      })
    })
  }
  valueByControl(control: string): string {
    return this.productForm.get(control)?.value;
  }



  // getCurrentDate(): string {
  //   const date = new Date()
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let day = date.getDay();
  //   let month = date.getMonth();
  //   let year = date.getFullYear();
  //   let currentDate = [hours, ':', minutes, ', ', day, '.', month, '.', year];
  //   return currentDate.join('');
  // }


}
