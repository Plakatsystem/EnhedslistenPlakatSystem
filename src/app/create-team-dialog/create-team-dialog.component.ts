import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource } from '@angular/material';
import { User } from '../entities/user';

@Component({
  selector: 'app-create-team-dialog',
  templateUrl: './create-team-dialog.component.html',
  styleUrls: ['./create-team-dialog.component.scss']
})
export class CreateTeamDialogComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  columnList = ['team', 'password'];
  done = false;
  teamType = 'O';
  error = false;

  constructor(public dialogRef: MatDialogRef<CreateTeamDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  /**
   * Sets variables depending on dialog stage
   */
  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.data as User[]);
    this.done = this.data.done;
    if (this.data.error) {
      this.error = this.data.error;
    }
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

  /**
   * Creates team and closes dialog box
   */
  createTeam() {
    this.dialogRef.close({ name: this.teamType, done: true});
  }
}
