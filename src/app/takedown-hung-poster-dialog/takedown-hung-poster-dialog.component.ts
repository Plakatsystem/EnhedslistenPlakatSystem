import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-takedown-hung-poster-dialog',
  templateUrl: './takedown-hung-poster-dialog.component.html',
  styleUrls: ['./takedown-hung-poster-dialog.component.scss']
})
export class TakedownHungPosterDialogComponent implements OnInit {

  hungPoster;

  constructor(public dialogRef: MatDialogRef<TakedownHungPosterDialogComponent>,
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
    this.router.navigate(['/edit-hung-poster']);
    this.dialogRef.close();
  }

}
