import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Poster } from '../entities/poster';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hang-poster',
  templateUrl: './hang-poster.component.html',
  styleUrls: ['./hang-poster.component.scss']
})
export class HangPosterComponent implements OnInit {
  choosePoster = new FormControl('', [Validators.required]);
  chooseAmount = new FormControl('', [Validators.min(1)]);

  dataSource = new MatTableDataSource<Poster>([]);
  poster: Poster;
  amount: number;


  constructor(private db: AngularFirestore,
              private auth: AuthService,
              public router: Router) {
  }

  /**
   * Sets Posters in dataSource variable
   */
  ngOnInit() {
    this.getPosters().subscribe((res) => {
      this.dataSource = new MatTableDataSource<Poster>(res as Poster[]);
    });
  }

  /**
   * Returns all Posters from current users Department
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
   * Checks validation and navigates
   */
  newPoster() {
    if (this.choosePoster.invalid || this.chooseAmount.invalid) {
      this.choosePoster.markAsTouched();
      this.chooseAmount.markAsTouched();
    }
    if (this.choosePoster.valid && this.chooseAmount.valid) {
      this.router.navigate(['hang-poster/map/' + this.poster.name + '/' + this.amount]);
    }
  }
}
