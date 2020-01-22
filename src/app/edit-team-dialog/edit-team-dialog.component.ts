import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import * as firebase from 'firebase';

@Component({
  selector: 'app-edit-team-dialog',
  templateUrl: './edit-team-dialog.component.html',
  styleUrls: ['./edit-team-dialog.component.scss']
})
export class EditTeamDialogComponent implements OnInit {
  user;
  newPassword;
  error = false;
  loading = true;

  constructor(public dialogRef: MatDialogRef<EditTeamDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  /**
   * Sets variable from injected data, creates randomized password and calls updatePassword method
   */
  ngOnInit() {
    this.loading = this.data.loading;
    this.user = this.data.user;
    this.newPassword = Math.random().toString(36).slice(-10).toUpperCase();
    this.updatePassword();
  }

  /**
   * Calls create new password method and updates it to DB
   */
  updatePassword() {
    var passwordChange = firebase.functions().httpsCallable('passwordChange');
    passwordChange({ pass: this.newPassword, uid: this.user.id}).then((result) => {
      this.loading = false;
      if (result.data.success === 'error') {
        this.error = true;
      }


    }).catch((err) => {
      console.log('ERROR', err);
    });
  }

  /**
   * Closes dialog box
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Opens print and sets title
   */
  print() {
    document.title = 'Teams';
    window.print();
  }
}
