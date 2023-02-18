import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user/user';
import { UserService } from 'src/app/services/user.service';
import {
  emailValidator,
  notNullValidator,
} from 'src/app/utilities/validators/validator';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: User = {} as User;
  isValid: any = true;
  constructor(
    private router: Router,
    private userFormGroups: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {

  }

  userFormGroup = this.userFormGroups.group({
    user_email: [this.user.email, emailValidator()],
    user_password: [this.user.password, notNullValidator()],

  });

  get user_email() { return this.userFormGroup.controls['user_email']; }
  get user_password() { return this.userFormGroup.controls['user_password']; }



  login() {
    this.userService.getUserLogin(this.user).subscribe((data: {}) => {
      this.isValid = data;
      this.valid();
    });
  }

  valid() {
    if (this.isValid == true) {
      this.router.navigate(['/user-Summary']);
    } else {

    }




  }

}
