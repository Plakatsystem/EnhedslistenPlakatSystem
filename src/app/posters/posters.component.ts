import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Poster } from '../entities/poster';
import { FormControl, Validators } from '@angular/forms';
import { CreatePosterDialogComponent } from '../create-poster-dialog/create-poster-dialog.component';
import { DeletePosterDialogComponent } from '../delete-poster-dialog/delete-poster-dialog.component';
import { EditPosterDialogComponent } from '../edit-poster-dialog/edit-poster-dialog.component';
import { HungPoster } from '../entities/hung-poster';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { variables } from 'src/assets/variables';


@Component({
  selector: 'app-posters',
  templateUrl: './posters.component.html',
  styleUrls: ['./posters.component.scss']
})
export class PostersComponent implements OnInit {
  dataSource = new MatTableDataSource<Poster>([]);
  columnList = ['name', 'stock', 'remainingStock', 'hungPosters', 'edit'];
  editing = false;
  posterName = new FormControl('', [Validators.required, Validators.pattern(/\S/)]);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private db: AngularFirestore,
              private authService: AuthService,
              public dialog: MatDialog) {
  }

  /**
   * Counts and sets amount of Hung Posters for each poster, sets dataSource variable and sorts it
   */
  ngOnInit() {
    let loadingDialog = this.dialog.open(LoadingDialogComponent, {
      width: '400px',
      disableClose: true
    });

    this.getPosters().subscribe((posters) => {
      this.getHungPosters();
      for (let i = 0; i < posters.length; i++) {
        this.getHungPosters().subscribe((hPosters) => {
          let number = 0;
          let hungPosters = hPosters as HungPoster[];
          hungPosters.forEach(element => {
            if (element.posterName === posters[i].name) {
              number = number + element.amount;
            }
          });
          posters[i].hungPosterAmount = number;
          posters[i].remainingStock = posters[i].stock - posters[i].hungPosterAmount;
        });
      }
      this.dataSource = new MatTableDataSource<Poster>(posters as Poster[]);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Plakater per side';
      this.paginator._intl.getRangeLabel = variables.danishRangeLabel;
      this.paginator._intl.previousPageLabel = 'Forrige side';
      this.paginator._intl.nextPageLabel = 'Næste side';
      this.dataSource.filterPredicate =
        (data: Poster, filter: string) => !filter ||
          data.name.toLowerCase().includes(filter.trim().toLowerCase()) ||
          data.stock.toString().includes(filter) ||
          data.remainingStock.toString().includes(filter) ||
          data.hungPosterAmount.toString().includes(filter);
      setTimeout((res) => {
        loadingDialog.close();
      }, 350);

    });
  }

  /**
   * Returns all Posters from current users Department in DB
   */
  onSortData() {
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string) => {
      const value: any = data[sortHeaderId];
      return typeof value === 'string' ? value.toLowerCase() : value;
    };
  }

  /**
   * Returns all posters from current department in DB
   */
  getPosters(): Observable<Poster[]> {
    return this.db.collection('posters', ref => ref.where('department', '==', this.authService.getUserData().department))
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
   * Returns all Hung Posters from current users Department in DB
   */
  getHungPosters(): Observable<HungPoster[]> {
    return this.db.collection('hungposters', ref => ref.where('department', '==', this.authService.getUserData().department))
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

  /**
   * Opens dialog box
   * @param poster
   */
  openDelete(poster) {
    this.dialog.open(DeletePosterDialogComponent, {
      width: '400px',
      data: {poster: poster},
      disableClose: true,
      autoFocus: false
    });
  }

  /**
   *
   * @param poster Opens dialog box
   */
  edit(poster) {
    const dialogRef = this.dialog.open(EditPosterDialogComponent, {
      width: '400px',
      data: {poster: poster},
      disableClose: true
    });
  }

  /**
   * Converts string to lower case
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Opens dialog box and adds Poster to DB when it's closed
   */
  openCreatePosterDialog(): void {
    const dialogRef = this.dialog.open(CreatePosterDialogComponent, {
      width: '400px',
      data: {name: '', stock: 0, done: false},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.db.collection('posters').add({
          department: this.authService.getUserData().department,
          name: res.name,
          stock: res.stock,
          remainingStock: res.stock
        } as Poster).then(r => {
          this.dialog.open(CreatePosterDialogComponent, {
            width: '400px',
            data: {name: res.name, stock: res.stock, done: true, loading:res.loading},
            disableClose: true
          });
        }).catch((err) => {
          setTimeout((res) => {
            res.loading.close();
          }, 350);
        });
      }
    });
  }
}
