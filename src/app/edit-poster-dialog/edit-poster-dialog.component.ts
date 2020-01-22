import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { HungPoster } from '../entities/hung-poster';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Poster } from '../entities/poster';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-edit-poster-dialog',
  templateUrl: './edit-poster-dialog.component.html',
  styleUrls: ['./edit-poster-dialog.component.scss']
})
export class EditPosterDialogComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  amount = new FormControl('', [Validators.min(1)]);

  poster;
  originalPosterName;
  originalStock;
  error;
  notFocused;

  constructor(public dialogRef: MatDialogRef<EditPosterDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private db: AngularFirestore,
              private authService: AuthService) {
  }

  /**
   * Sets variables from injected data
   */
  ngOnInit() {
    this.poster = this.data.poster;
    this.originalPosterName = this.data.poster.name;
    this.originalStock = this.data.poster.stock;
  }

  /**
   * Closes dialog box and reverts name and stock
   */
  cancel(): void {
    this.dialogRef.close();
    this.poster.name = this.originalPosterName;
    this.poster.stock = this.originalStock;
  }

  /**
   * Checks validation, if Poster exists in DB and updates Poster in DB
   */
  updatePoster() {
    let exist = false;
    if (this.poster.name.length > 0 && this.poster.stock > 0) {
      this.getPostersByDepartment(this.authService.getUserData().department).subscribe((posters) => {
        let nameExists;
        for (let i = 0; i < posters.length; i++) {
          if (posters[i].name.toLowerCase() === this.poster.name.toLowerCase()) {
            nameExists = posters[i].name;
            exist = true;
          }
        }
        if (!exist || nameExists.toLowerCase() === this.poster.name.toLowerCase()) {
          this.db.collection('posters').doc(this.poster.id).update({ name: this.poster.name, stock: this.poster.stock});
          this.updateHungPosters(this.originalPosterName, this.poster.name);
          this.dialogRef.close();
        } else {
          this.error = 'Der er allerede en plakat med samme navn';
        }
      });
    }
  }

  /**
   * Updates Hung Poster in DB
   * @param oldPosterName
   * @param newPosterName
   */
  updateHungPosters(oldPosterName, newPosterName) {
    let sub = this.db.collection('hungposters', ref => ref.where('posterName', '==', oldPosterName)).snapshotChanges()
      .subscribe((hungPosters) => {
        hungPosters.forEach((p) => {
          this.db.collection('hungposters').doc(p.payload.doc.id).update({ posterName: newPosterName}).then(() => {
            sub.unsubscribe();
          });
        });
      });
  }

  /**
   * Returns all Posters from X Department in DB
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
