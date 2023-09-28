import { Component } from '@angular/core';
import { Storage, deleteObject, getDownloadURL, percentage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponce } from 'src/app/shared/interface/common.interface';
import { CategoryService } from 'src/app/shared/services/category/category.service';

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent {
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private storage: Storage
  ) { }
  ngOnInit(): void {
    this.initCategoryForm()
    this.getCategories()
  }

  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imagePath: [null, Validators.required]
    })
  }


  public categoryForm!: FormGroup;
  public categories = this.categoryService.categories;
  public uploadPercent!: number;
  public categoryId!: number;

  public isImgUploaded: boolean = false;
 
  public clickAddBtn: boolean = false;

  public isUpdatePressed: boolean = false;




//отримує масив  з db.json
  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data
    })

  }

  //створює нову знижку і надсилає її в db.json
  addCategory() {
    this.categoryService.create(this.categoryForm.value).subscribe(() => {
      this.getCategories();
      this.isImgUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.reset();
    })
  }

  //видаляє конкретну категорію з db.json
  clickDeleteCurrentCategory(category: ICategoryResponce): void {
    if (confirm("are you sure")) {
      this.categoryService.delete(category.id).subscribe(() => {
        const task = ref(this.storage, category.imagePath);
        deleteObject(task).then(() => {
          console.log('File deleted');
        })
        this.getCategories();
      })
    }
  }

  showAddMenu(): void {
    this.clickAddBtn === true ? this.clickAddBtn = false : this.clickAddBtn = true;
  }
  //при натисканні витягує з db.json конкретну знижку і заповнює поля її значеннями
  clickUpdateCurrentCategory(category: ICategoryResponce): void {
    if (this.clickAddBtn === false) {
      this.clickAddBtn = true;
    }
    this.categoryForm.patchValue({
      name: category.name,
      path: category.path,
      imagePath: category.imagePath
    })
    this.categoryId = category.id
    this.isUpdatePressed = true;
    this.isImgUploaded = true;
  }

  updateCategory() {
    this.categoryService.update(this.categoryForm.value, this.categoryId).subscribe(() => {
      this.getCategories();
      this.categoryForm.reset();
      this.isUpdatePressed = false;
      this.isImgUploaded = false;
      this.uploadPercent = 0;
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    console.log(file)
    this.uploaFile('images/category', file.name, file)
      .then(data => {
        this.categoryForm.patchValue({
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
    deleteObject(task).then(() => {
      console.log('File deleted');
      this.isImgUploaded = false;
      this.uploadPercent = 0;
      this.categoryForm.patchValue({
        imagePath: null
      })
    })
  }
  valueByControl(control: string): string {
    return this.categoryForm.get(control)?.value;
  }
}
