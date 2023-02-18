import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { UserAdd } from 'src/app/models/user/userAdd';
import { UserService } from 'src/app/services/user.service';
import { emailValidator, notNullValidator } from 'src/app/utilities/validators/validator';
import Swal from 'sweetalert2';
import designations from 'src/app/enums/designations.json';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  designations: any;
  isSubmitting: boolean;
  user: User = {} as User;

  constructor(
    private userFormGroups: FormBuilder,
    public userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.isSubmitting = false;
    this.designations = designations;
  }

  userFormGroup = this.userFormGroups.group({
    user_firstName: [this.user.firstName, notNullValidator()],
    user_lastName: [this.user.lastName, notNullValidator()],
    user_email: [this.user.email, emailValidator()],
    user_phoneNumber: [this.user.phoneNumber, notNullValidator()],
    user_designation: [this.user.designation, notNullValidator()],
    user_password: [this.user.password, notNullValidator()],
  });

  get user_firstName() { return this.userFormGroup.controls['user_firstName']; }
  get user_lastName() { return this.userFormGroup.controls['user_lastName']; }
  get user_email() { return this.userFormGroup.controls['user_email']; }
  get user_phoneNumber() { return this.userFormGroup.controls['user_phoneNumber']; }
  get user_designation() { return this.userFormGroup.controls['user_designation']; }
  get user_password() { return this.userFormGroup.controls['user_password']; }

  submitUser() {
    if (this.userFormGroup['valid']) {
      this.userService.createUser(this.prepareUserAddObject()).subscribe(response => {
        if (response == true) {
          this.position();
        } else {
          this.errorResponse();
        }
      })
    }
  }

  /**
* position sweet alert
* @param position modal content
*/
  errorResponse() {
    Swal.fire({
      position: 'center',
      icon: 'question',
      title: 'Error Creating User',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  cancell() {
    this.router.navigate(['user-Summary']);
  }

  /**
 * position sweet alert
 * @param position modal content
 */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'User Created',
      showConfirmButton: false,
      timer: 2500,
    });
    this.router.navigate(['user-Summary']);
  }

  /**
* position sweet alert
* @param position modal content
*/
  positionNegative() {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Please make sure all fields are valid "Marked in green"',
      showConfirmButton: false,
      timer: 2500,
    });
    // this.workshopForm.markAllAsTouched();
  }

  prepareUserAddObject(): UserAdd {
    const formValue = this.userFormGroup.value;
    const userObj: UserAdd = {
      firstName: formValue.user_firstName,
      lastName: formValue.user_lastName,
      email: formValue.user_email,
      phoneNumber: formValue.user_phoneNumber,
      designation: formValue.user_designation,
      password: formValue.user_password
    };
    return userObj;
  }
}
