import { HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { HTTPService } from 'src/app/services/http.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {
  showAlert = false;
  alertText = '';
  public createUserForm: FormGroup;
  public passwordForm: FormGroup;
  submitted = false;
  pswrdFormSubmitted = false
  passwordMatch = false;
  userData: any;
  changePasswordUser: any
  showUsertemplate = true;
  showDeleteDialog = false;
  selectedUserId: any;
  public searchForm = this.formBuilder.group({
    userName: new FormControl(''),
    loginId: new FormControl('')
  })

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
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', [Validators.required])
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
    const confrmPswrd = formGroup.get('confirmPassword');

    this.passwordMatch = confrmPswrd?.value && (pswrd?.value === confrmPswrd?.value);
  }

  changePassword(user: any) {
    this.changePasswordUser = user
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
        this.clearDeleteUserData();
        this.getUserData();
        window.scrollTo(0,0);
        this.showAlert = true;
        this.alertText = "User Deleted Successfully."
        this.hideAlert();
      }, error => {
        console.log(error);
        this.showAlert = true;
        this.alertText = "Something went wrong, please try again."
        this.clearDeleteUserData();
        this.getUserData();
        window.scrollTo(0,0);
        this.hideAlert();
      }
    )
  }

  clearDeleteUserData() {
    this.showDeleteDialog = false;
    this.selectedUserId = null;
  }

  submitForm() {
    this.submitted = true;
    const apiEndPoint = 'user';
    const body = this.createUserForm.value;
    body['userType'] = 'admin';
    this.http.create(apiEndPoint, body).subscribe(
      (data) => {
        this.submitted = false;
        this.showAlert = true;
        this.alertText = "User Created Successfully.";
        this.createUserForm.reset();
        this.getUserData();
        window.scrollTo(0, document.body.scrollHeight);
        this.hideAlert();
      }
    )
  }

  submitPswrdForm() {
    this.pswrdFormSubmitted = true;
    const apiEndPoint = 'auth/reset-password'
    this.http.create(apiEndPoint, { loginId: this.changePasswordUser.loginId, ...this.passwordForm.value }).subscribe(
      (data) => {
        this.showUsertemplate = true;
      }
    )
  }

  getUserData() {
    const apiEndPoint = 'user'
    this.http.get(apiEndPoint).subscribe(
      (data) => {
        this.userData = data;
      });
  }

  getFilteredData() {
    let params = new HttpParams()
    if (this.searchForm.value.userName) params = params.set('name', this.searchForm.value.userName)
    if (this.searchForm.value.loginId) params = params.set('loginId', this.searchForm.value.loginId)
    this.http.get('user/search', params).subscribe((data) => this.userData = data)
  }

  hideAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 5 * 1000);
  }
}
