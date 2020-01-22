import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-department-dialog',
  templateUrl: './delete-department-dialog.component.html',
  styleUrls: ['./delete-department-dialog.component.scss']
})
export class DeleteDepartmentDialogComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data,
               public dialogRef: MatDialogRef<DeleteDepartmentDialogComponent>) { }

  ngOnInit() {
  }

  /**
   * Closes dialog box
   */
  closeDialog() {
    this.dialogRef.close(false);
  }
}
