import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HTTPService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;
  public passwordForm: FormGroup;
  submitted = false;
  pswrdFormSubmitted = false
  passwordMatch = false;
  userData: any;
  showUsertemplate = true;
  showDeleteDialog = false;
  selectedUserId: any;

  constructor(private formBuilder: FormBuilder, private http: HTTPService) {
    this.createUserForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      loginId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required])
    },
      {
        validators: this.confirmPassword.bind(this)

      }
    );

    this.passwordForm = this.formBuilder.group({
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmNewPassword: new FormControl('', [Validators.required])
    },
      {
        validators: this.confirmNewPassword.bind(this)

      });

    this.getUserData();
  }

  confirmPassword(formGroup: FormGroup) {
    const pswrd = formGroup.get('password');
    const confrmPswrd = formGroup.get('confirmPassword');
    this.passwordMatch = confrmPswrd?.value && (pswrd?.value === confrmPswrd?.value);
  }

  confirmNewPassword(formGroup: FormGroup) {
    const pswrd = formGroup.get('newPassword');
    const confrmPswrd = formGroup.get('confirmNewPassword');
    this.passwordMatch = confrmPswrd?.value && (pswrd?.value === confrmPswrd?.value);
  }

  ngOnInit() {

  }

  changePassword() {
    this.showUsertemplate = false;
  }

  deleteUser(id: any) {
    this.showDeleteDialog = true;
    this.selectedUserId = id;
  }

  deleteUserData() {
    const apiEndPoint = 'user';
    this.http.delete(apiEndPoint, this.selectedUserId).subscribe(
      (data) => {
        this.cancelDeleteUserData();
        console.log(data);
      }, error =>{
        console.log(error);
        this.cancelDeleteUserData();
      }
    )
  }

  cancelDeleteUserData() {
    this.showDeleteDialog = false;
    this.selectedUserId = null;
  }

  submitForm() {
    this.submitted = true;
    console.log(JSON.stringify(this.createUserForm.value));
    const apiEndPoint = 'user'
    const body = JSON.stringify(this.createUserForm.value);
    this.http.create(apiEndPoint, body).subscribe(
      (data) => {
        console.log(data);
      }
    )
  }

  submitPswrdForm() {
    this.pswrdFormSubmitted = true;
    console.log(JSON.stringify(this.passwordForm.value));
    const apiEndPoint = 'auth/reset/password'
    const body = JSON.stringify(this.passwordForm.value);
    this.http.create(apiEndPoint, body).subscribe(
      (data) => {
        console.log(data);
        this.showUsertemplate = true;
      }
    )
  }

  getUserData() {
    const apiEndPoint = 'user'
    this.http.get(apiEndPoint).subscribe(
      (data) => {
        console.log(data);

        this.userData = data;
      });
  }
}
