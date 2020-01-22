import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-delete-hung-poster-dialog',
  templateUrl: './delete-hung-poster-dialog.component.html',
  styleUrls: ['./delete-hung-poster-dialog.component.scss']
})
export class DeleteHungPosterDialogComponent implements OnInit {
  hungPoster;

  constructor(public dialogRef: MatDialogRef<DeleteHungPosterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore,
              private router: Router,
              private authService: AuthService) {
  }

  /**
   * Sets variable from injected data
   */
  ngOnInit() {
    this.hungPoster = this.data.hungPoster;
  }

  /**
   * Closes dialog box
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Deletes Hung Poster closes dialog box and redirects
   */
  delete() {
    this.db.collection('hungposters').doc(this.hungPoster.id).delete();
    if (this.authService.getUserData().username.toLowerCase().startsWith('o')) {
      this.router.navigate(['/map']);
    } else {
      this.router.navigate(['/edit-hung-poster']);
    }
    this.dialogRef.close();
  }
}
