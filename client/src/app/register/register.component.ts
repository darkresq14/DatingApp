import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  registerForm!: FormGroup;
  maxDate: Date = new Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
    // this.maxDate = new Date;
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues("password")]],
    })
  }

  // With FormGroup

  // initializeForm() {
  //   this.registerForm = new FormGroup({
  //     gender: new FormControl('male'),
  //     username: new FormControl('', Validators.required),
  //     knownAs: new FormControl('', Validators.required),
  //     dateOfBirth: new FormControl('', Validators.required),
  //     city: new FormControl('', Validators.required),
  //     country: new FormControl('', Validators.required),
  //     password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
  //     confirmPassword: new FormControl('', [Validators.required, this.matchValues2("password")]),
  //   })
  // }

  // matchValues(matchTo: string): ValidatorFn {
  //   return (control: AbstractControl) => {
  //     return control.get("confirmPassword") === control.get(matchTo) ? null : { isMatching: true }
  //   }
  // }
  // TODO
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value
        ? null : { isMatching: true }
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      // this.cancel();
      this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
      // console.log(error);
      // this.toastr.error(error);
      // this.toastr.error(error.statusText === "OK" ?"Unauthorised" : error.statusText, error.status);
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
