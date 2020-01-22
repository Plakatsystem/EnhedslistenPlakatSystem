import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog, MatSort, MatTableDataSource, MatPaginator} from '@angular/material';
import {AuthService} from '../auth/auth.service';
import {User} from '../entities/user';
import * as firebase from 'firebase';
import {CreateTeamDialogComponent} from '../create-team-dialog/create-team-dialog.component';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {DeleteTeamDialogComponent} from '../delete-team-dialog/delete-team-dialog.component';
import {Router} from '@angular/router';
import {EditTeamDialogComponent} from '../edit-team-dialog/edit-team-dialog.component';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';
import { variables } from 'src/assets/variables';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  dataSource = new MatTableDataSource<User>([]);
  columnList = ['username', 'teamType', 'password', 'edit'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private db: AngularFirestore, private authService: AuthService, public dialog: MatDialog, private router: Router) {
  }

  /**
   * Opens dialog box, sets and sorts dataSource
   */
  ngOnInit() {
    let loadingDialog = this.dialog.open(LoadingDialogComponent, {
      width: '400px',
      disableClose: true
    });
    this.getTeams().subscribe((res) => {
      let teams = res.filter((user) => user.role === 'TEAM');
      this.dataSource = new MatTableDataSource<User>(teams as User[]);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Teams per side';
      this.paginator._intl.getRangeLabel = variables.danishRangeLabel;
      this.paginator._intl.previousPageLabel = 'Forrige side';
      this.paginator._intl.nextPageLabel = 'Næste side';
      this.dataSource.filterPredicate =
        (data: User, filter: string) => !filter ||
          data.username.toLowerCase().includes(filter.trim().toLowerCase());
      setTimeout((res) => {
        loadingDialog.close();
      }, 350);
    });

  }

  /**
   * Returns all Teams from current users Department in DB
   */
  getTeams(): Observable<User[]> {
    return this.db.collection('users', ref => ref.where('department', '==', this.authService.getUserData().department)
      .orderBy('username')).snapshotChanges().pipe(map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data() as User;
        return {
          id: action.payload.doc.id,
          username: data.username,
          department: data.department,
          role: data.role
        };
      });
    }));
  }

  /**
   * Opens dialog box and calls createTeam method when it's closed
   */
  openCreateTeam() {
    const dialogRef = this.dialog.open(CreateTeamDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {role: '', done: false},
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let loadingDialog = this.dialog.open(LoadingDialogComponent, {
          width: '400px',
          disableClose: true
        });
        this.createTeam(res.name, loadingDialog);
      }
    });
  }

  /**
   * Creates new Team user with randomized password and email suffix before opening dialog box with user information
   * @param teamType
   */
  createTeam(teamType, loadingDialog) {
    let username = teamType;
    let nameRef = this.db.collection('namegen').doc('team');
    nameRef.get()
      .subscribe((res) => {
        let teamNumber = String(res.data().value);
        username += teamNumber.padStart(4, '0');
        let email = (username + variables.emailSuffix);
        var randompass = Math.random().toString(36).slice(-10).toUpperCase();
        nameRef.update({value: firebase.firestore.FieldValue.increment(1)});
        this.authService.afAuth.auth.createUserWithEmailAndPassword(email, '' + randompass)
          .then((res) => {
            this.db.collection('users').doc(res.user.uid).set({
              username: username,
              department: this.authService.getUserData().department,
              role: 'TEAM'
            });
            this.authService.login(this.authService.getEmail(), this.authService.getPassword()).then((res) => {
              this.router.navigate(['/teams']);
              //Open dialog and show created team
              this.dialog.open(CreateTeamDialogComponent, {
                width: '400px',
                disableClose: true,
                data: {
                  username: username,
                  password: randompass,
                  department: this.authService.getUserData().department,
                  done: true
                },
                autoFocus: false
              });
              setTimeout((res) => {
                loadingDialog.close();
              }, 350);
            });
          }, (err) => {
            setTimeout((res) => {
              loadingDialog.close();
            }, 350);
            this.dialog.open(CreateTeamDialogComponent, {
              width: '300px',
              disableClose: true,
              data: {
                error: true
              },
              autoFocus: false
            });
          });
      });
  }

  /**
   * Opens dialog box and calls delete method after it's closed
   * @param user
   */
  openDelete(user) {
    const dialogRef = this.dialog.open(DeleteTeamDialogComponent, {
      width: '400px',
      disableClose: true,
      data: user
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.delete(user);
      }
    });
  }

  /**
   * Deletes user from DB
   * @param user
   */
  delete(user) {
    this.db.collection('users').doc(user.id).delete();
  }

  /**
   * Opens dialog box with user information
   * @param user
   */
  edit(user) {
    this.dialog.open(EditTeamDialogComponent, {
      width: '400px',
      disableClose: true,
      autoFocus: false,
      data: {user: user, loading: true}
    });
  }

  /**
   * Converts string to lower case
   * @param filterValue
   */
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
