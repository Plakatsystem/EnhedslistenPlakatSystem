import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Poster } from '../entities/poster';
import { AuthService } from '../auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';

@Component({
  selector: 'app-create-poster-dialog',
  templateUrl: './create-poster-dialog.component.html',
  styleUrls: ['./create-poster-dialog.component.scss']
})
export class CreatePosterDialogComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  amount = new FormControl('', [Validators.min(1)]);

  posterName: string;
  stock: number;
  done = false;
  error;
  notFocused;
  constructor(public dialogRef: MatDialogRef<CreatePosterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore,
              private authService: AuthService,
              private dialog: MatDialog) {
  }

  /**
   * Sets variables depending on dialog stage
   */
  ngOnInit() {
    this.done = this.data.done;
    this.posterName = this.data.name;
    this.stock = this.data.stock;
    if(this.data.loading){
      this.data.loading.close();
    }
  }

  /**
   * Closes dialog box
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Checks for duplicates in db, closes dialog box and creates Poster
   */
  createPoster() {
    let exist = false;
    if (this.amount.invalid) {
      this.amount.markAsTouched();
    }
    if (this.posterName.length > 0 && this.stock > 0) {
      this.getPostersByDepartment(this.authService.getUserData().department).subscribe((posters) => {
        for (let i = 0; i < posters.length; i++) {
          if (posters[i].name.toLowerCase() === this.posterName.toLowerCase()) {
            exist = true;
          }
        }
        if (!exist) {
          let loadingDialog = this.dialog.open(LoadingDialogComponent, {
            width: '400px',
            disableClose: true
          });
          this.dialogRef.close({name: this.posterName, stock: this.stock, loading: loadingDialog});
        } else {
          this.error = 'Der er allerede en plakat med samme navn';
        }
      });
    }
  }

  /**
   * Returns all posters from X Department
   * @param departmentName
   */
  getPostersByDepartment(departmentName): Observable<Poster[]> {
    return this.db.collection('posters', ref => ref.where('department', '==', departmentName))
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Poster;
          return {
            id: action.payload.doc.id,
            department: data.department,
            name: data.name,
            remainingStock: data.remainingStock,
            stock: data.stock
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
