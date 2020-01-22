import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {MatDialog} from '@angular/material';
import { variables } from '../../assets/variables';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  hidePassword = true;

  constructor(private fb: FormBuilder,
              private authService: AuthService) {
  }

  /**
   * Sets loginForm as formGroup with username and password
   */
  ngOnInit() {
    this.loginForm = this.fb.group(
      {
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    );
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      let username = (this.loginForm.controls.username.value).toLowerCase();
      username = this.convertUsername(username);
      this.loginWithUsernameAndPassword(username, this.loginForm.controls.password.value);
    }
  }

  /**
   * Checks authService with username/password and navigates
   * @param email
   * @param password
   */
  loginWithUsernameAndPassword(email, password): any {
    this.authService.login(email, password)
      .then(res => {
        this.successMessage = 'Du er nu logget ind';
        this.authService.loadUserData();
        this.authService.password = password;
        this.authService.email = email;

      }, err => {
        this.errorMessage = this.translateErrorMessage(err.code);
      });
  }

  /**
   * Adds suffix to username
   * @param username
   */
  convertUsername(username): string {
    if (!username.includes('@')) {
      username = username + variables.emailSuffix;
    }
    return username;
  }

  /**
   * Adds custom error codes
   * @param errCode
   */
  translateErrorMessage(errCode): string {
    let error = errCode.split('/')[1];
    switch (error) {
      case 'invalid-email':
        return 'Brugernavnet er ikke gyldigt';
      case 'user-not-found':
        return 'Brugernavn eller adgangskode er forkert';
      case 'wrong-password':
        return 'Brugernavn eller adgangskode er forkert';
      default:
        return 'Der skete en uventet fejl';
    }
  }

}
