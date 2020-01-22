import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-delete-poster-dialog',
  templateUrl: './delete-poster-dialog.component.html',
  styleUrls: ['./delete-poster-dialog.component.scss']
})
export class DeletePosterDialogComponent implements OnInit {
  poster;

  constructor(public dialogRef: MatDialogRef<DeletePosterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore) {
  }

  /**
   * Sets variable from injected data
   */
  ngOnInit() {
    this.poster = this.data.poster;
  }

  /**
   * Closes dialog box
   */
  cancel() {
    this.dialogRef.close();
  }

  /**
   * Deletes Poster and closes dialog
   */
  delete() {
    this.db.collection('posters').doc(this.poster.id).delete();
    this.dialogRef.close();
  }

}
