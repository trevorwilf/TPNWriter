import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../share/auth/auth.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  userForm: FormGroup;
  newUser = true; // to toggle login or signup form
  passReset = false; // set to true when password reset is triggered
  formErrors = {
    'email': '',
    'password': ''
  };
  validationMessages = {
    'email': {
      'required': 'Email is required.',
      'email': 'Email must be a valid email'
    },
    'password': {
      'required': 'Password is required.',
      'pattern': 'Password must be include at one letter and one number.',
      'minlength': 'Password must be at least 4 characters long.',
      'maxlength': 'Password cannot be more than 40 characters long.',
    }
  };

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.buildForm();
  }

  toggleForm() {
    this.newUser = !this.newUser;
  }

  signup(): void {
    this.auth.emailSignUp(this.userForm.value['email'], this.userForm.value['password'])
    .then(() => this.afterSignIn());
  }

  login(): void {
    this.auth.emailLogin(this.userForm.value['email'], this.userForm.value['password'])
    .then(() => this.afterSignIn());
  }

  resetPassword() {
    this.auth.resetPassword(this.userForm.value['email'])
      .then(() => this.passReset = true);
  }

  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  private afterSignIn(): void {
    // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['freetpn']);
  }

  // Updates validation state on form changes.
  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}
