import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Department } from '../entities/department';
import { map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-department-dialog',
  templateUrl: './edit-department-dialog.component.html',
  styleUrls: ['./edit-department-dialog.component.scss']
})
export class EditDepartmentDialogComponent implements OnInit {
  name = new FormControl('', [Validators.required]);

  originalName;
  department;
  error;
  notFocused;

  constructor(public dialogRef: MatDialogRef<EditDepartmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore) {
  }

  /**
   * Sets variables from injected data
   */
  ngOnInit() {
    this.department = this.data.department;
    this.originalName = this.data.department.name;
  }

  /**
   * Closes dialog box and reverts Department name
   */
  cancel(): void {
    this.department.name = this.originalName;
    this.dialogRef.close();
  }

  /**
   * Checks for validation and duplicates, updates Department name and closes dialog box
   */
  updateDepartment() {
    if (this.department.name.length > 0) {
      this.getDepartments(this.department.name).subscribe((departments) => {
        let nameExists;
        let exist = false;
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].name.toLowerCase() === this.department.name.toLowerCase()) {
            nameExists = departments[i].name;
            exist = true;
          }
        }
        if (!exist || nameExists.toLowerCase() == this.originalName.toLowerCase()) {
          this.dialogRef.close({ name: this.department.name});
        } else {
          this.error = 'Der eksisterer allerede en afdeling med dette navn';
        }
      });
    }
  }

  /**
   * Returns X Department from DB
   * @param departmentName
   */
  getDepartments(departmentName): Observable<Department[]> {
    return this.db.collection('departments')
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Department;
          return {
            id: action.payload.doc.id,
            manager: data.manager,
            name: data.name,
          };
        });
      }));
  }

  /**
   * Changes focus on icons
   */
  inputFocus() {
    this.error = false;
    this.notFocused = false;
  }
}
