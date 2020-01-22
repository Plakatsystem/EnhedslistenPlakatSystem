import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {Observable} from 'rxjs';
import {Department} from '../entities/department';
import {map} from 'rxjs/operators';
import {FormControl, Validators} from '@angular/forms';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-create-department-dialog',
  templateUrl: './create-department-dialog.component.html',
  styleUrls: ['./create-department-dialog.component.scss']
})
export class CreateDepartmentDialogComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  done: false;
  notFocused;

  departmentName: string;
  department: string;
  manager;
  error;
  loading;

  constructor(public dialogRef: MatDialogRef<CreateDepartmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore,
              private dialog: MatDialog) {
  }

  /**
   * Sets variables depending on dialog stage
   */
  ngOnInit() {
    this.done = this.data.done;
    if (this.done) {
      this.department = this.data.department;
      this.manager = this.data.manager;
    }

  }

  /**
   * Closes dialog box
   */
  cancel(): void {
    this.dialogRef.close();
    if (this.loading) {
      this.loading.close();
    }
  }

  /**
   * Checks for duplicates in db and creates Department
   */
  createDepartment(): void {
    if (this.departmentName.length > 0) {
      this.getDepartments().subscribe((departments) => {
        let exist = false;
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].name.toLowerCase() === this.departmentName.toLowerCase()) {
            exist = true;
          }
        }

        if (!exist) {
          let loadingDialog = this.dialog.open(LoadingDialogComponent, {
            width: '400px',
            disableClose: true
          });
          this.loading = loadingDialog;
          let username = 'M';
          let nameRef = this.db.collection('namegen').doc('manager');
          nameRef.get()
            .subscribe((res) => {
              let managerNumber = String(res.data().value);
              username += managerNumber.padStart(4, '0');
              var randompass = Math.random().toString(36).slice(-10).toUpperCase();
              nameRef.update({value: firebase.firestore.FieldValue.increment(1)});
              loadingDialog.close();
              this.dialogRef.close({
                departmentName: this.departmentName,
                username: username,
                pass: randompass,
                loading: loadingDialog
              });
            });
        } else {
          this.error = 'Der eksisterer allerede en afdeling med dette navn';
          if (this.loading) {
            this.loading.close();
          }
        }
      });
    }
  }

  /**
   * Returns all Departmens from DB
   */
  getDepartments(): Observable<Department[]> {
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

  /**
   * Opens print and sets title
   */
  print() {
    document.title = 'Teams';
    window.print();
  }
}
