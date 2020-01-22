import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HungPoster } from '../entities/hung-poster';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Poster } from '../entities/poster';
import { AuthService } from '../auth/auth.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { EditDepartmentDialogComponent } from '../edit-department-dialog/edit-department-dialog.component';
import { DeleteHungPosterDialogComponent } from '../delete-hung-poster-dialog/delete-hung-poster-dialog.component';

@Component({
  selector: 'app-edit-hung-poster',
  templateUrl: './edit-hung-poster.component.html',
  styleUrls: ['./edit-hung-poster.component.scss']
})
export class EditHungPosterComponent implements OnInit {
  choosePoster = new FormControl('', [Validators.required]);
  chooseAmount = new FormControl('', [Validators.min(1)]);
  hungPoster;
  posters: Poster[];
  posterName;
  amount: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private db: AngularFirestore,
              private auth: AuthService,
              private dialog: MatDialog) {
  }

/**
 * Sets hungPoster as Hung Poster matching to params ID in DB and set posters from getPosters method
 */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.loadHungPosters().subscribe((res) => {
        let hungPosters = res as HungPoster[];
        for (let i = 0; i < hungPosters.length; i++) {
          if (hungPosters[i].id === params.id) {
            this.hungPoster = hungPosters[i];
          }
        }
      });
    });
    this.getPosters().subscribe((res) => {
      this.posters = res as Poster[];
    });
  }

  /**
   * Updates Poster in DB
   */
  updatePoster() {
    if (this.choosePoster.valid && this.chooseAmount.valid) {
      this.db.collection('hungposters').doc(this.hungPoster.id).update({
        posterName: this.hungPoster.posterName,
        amount: this.hungPoster.amount
      });
      this.router.navigate(['edit-hung-poster/map/' + this.hungPoster.id]);
    }
  }

  /**
   * Opens dialog box
   */
  deletePoster() {
    const dialogRef = this.dialog.open(DeleteHungPosterDialogComponent, {
      width: '400px',
      // minHeight: '100%',
      minWidth: '100%',
      disableClose: true,
      data: { hungPoster: this.hungPoster}
    });
  }

  /**
   * Returns all current users Departments Posters from DB
   */
  getPosters(): Observable<Poster[]> {
    return this.db.collection('posters', ref => ref.where('department', '==', this.auth.getUserData().department))
      .snapshotChanges().pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Poster;
          return {
            id: action.payload.doc.id,
            name: data.name,
            department: data.department,
            stock: data.stock,
            remainingStock: data.remainingStock
          };
        });
      }));
  }

  /**
   * Returns all Hung Posters from DB
   */
  loadHungPosters(): Observable<HungPoster[]> {
    return this.db.collection('hungposters')
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as HungPoster;
          return {
            id: action.payload.doc.id,
            posterName: data.posterName,
            location: data.location,
            amount: data.amount,
            time: data.time,
            teamName: data.teamName,
            department: data.department
          };
        });
      }));
  }
}
