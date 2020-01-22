import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DeleteDepartmentDialogComponent } from '../delete-department-dialog/delete-department-dialog.component';

@Component({
  selector: 'app-delete-team-dialog',
  templateUrl: './delete-team-dialog.component.html',
  styleUrls: ['./delete-team-dialog.component.scss']
})
export class DeleteTeamDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
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
