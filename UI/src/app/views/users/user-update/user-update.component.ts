import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';
import { emailValidator, notNullValidator } from 'src/app/utilities/validators/validator';
import Swal from 'sweetalert2';
import designations from 'src/app/enums/designations.json';
import { UserUpdate } from 'src/app/models/user/userUpdate';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit {

  designations: any;
  isSubmitting: boolean;
  user: User = {} as User;
  Id: string;
  constructor(
    private userFormGroups: FormBuilder,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { this.Id = this.route.snapshot.queryParamMap.get('record'); }

  ngOnInit(): void {
    this.isSubmitting = false;
    this.designations = designations;
    this.fetchUser();
  }

  fetchUser() {
    this.userService.getUser(this.Id).subscribe((data: any) => {
      this.user = data;
    });
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
      this.userService.updateUser(this.prepareUserUpdateObject()).subscribe(response => {
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
      title: 'Error Updating User',
      showConfirmButton: false,
      timer: 2500,
    });
  }
  /**
 * position sweet alert
 * @param position modal content
 */
  position() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'User Updated',
      showConfirmButton: false,
      timer: 2500,
    });
    this.router.navigate(['user-Summary']);
  }

  cancel() {
    this.router.navigate(['user-Summary']);
  }



  remove() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actionRemove();
      }
    })
  }

  actionRemove() {
    this.userService.deleteUser(this.Id).subscribe(response => {
      if (response == true) {
        this.positionRemove();
      } else {
        this.errorResponseRemove();
      }

    })
  }

  /**
* position sweet alert
* @param position modal content
*/
  errorResponseRemove() {
    Swal.fire({
      position: 'center',
      icon: 'question',
      title: 'Error Removing User',
      showConfirmButton: false,
      timer: 2500,
    });
  }
  /**
  * position sweet alert
  * @param position modal content
  */
  positionRemove() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'User Removed',
      showConfirmButton: false,
      timer: 2500,
    });
    this.router.navigate(['user-Summary']);
  }





  prepareUserUpdateObject(): UserUpdate {
    const formValue = this.userFormGroup.value;
    const userObj: UserUpdate = {
      id: this.user.id,
      firstName: formValue.user_firstName,
      lastName: formValue.user_lastName,
      email: formValue.user_email,
      phoneNumber: formValue.user_phoneNumber,
      designation: formValue.user_designation
    };
    return userObj;
  }

}
