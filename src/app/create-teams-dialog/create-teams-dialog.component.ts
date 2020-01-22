import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DeleteDepartmentDialogComponent } from '../delete-department-dialog/delete-department-dialog.component';

@Component({
  selector: 'app-create-teams-dialog',
  templateUrl: './create-teams-dialog.component.html',
  styleUrls: ['./create-teams-dialog.component.scss']
})
export class CreateTeamsDialogComponent implements OnInit {
  numbers;
  numberOfTeams;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialogRef: MatDialogRef<DeleteDepartmentDialogComponent>) {
    this.numbers = new Array(9).fill(0).map((x, i) => i + 2);
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }
}
