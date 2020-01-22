import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { Department } from '../entities/department';
import { CreateDepartmentDialogComponent } from '../create-department-dialog/create-department-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { DeleteDepartmentDialogComponent } from '../delete-department-dialog/delete-department-dialog.component';
import { EditDepartmentDialogComponent } from '../edit-department-dialog/edit-department-dialog.component';
import { LoadingDialogComponent } from '../loading-dialog/loading-dialog.component';
import { EditManagerDialogComponent } from '../edit-manager-dialog/edit-manager-dialog.component';
import { User } from '../entities/user';
import { variables } from '../../assets/variables';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.scss']
})


export class DepartmentsComponent implements OnInit {
  dataSource = new MatTableDataSource<Department>([]);
  columnList = ['name', 'manager', 'password', 'edit'];
  department;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  constructor(private db: AngularFirestore,
              public dialog: MatDialog,
              private authService: AuthService,
              private router: Router) {
  }

  /**
   * Sets Departments in dataSource variable
   */
  ngOnInit() {
    let loadingDialog = this.dialog.open(LoadingDialogComponent, {
      width: '400px',
      disableClose: true
    });

    this.getDepartments().subscribe((res) => {
      this.dataSource = new MatTableDataSource<Department>(res as Department[]);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Afdelinger per side';
      this.paginator._intl.getRangeLabel = variables.danishRangeLabel;
      this.paginator._intl.previousPageLabel = 'Forrige side';
      this.paginator._intl.nextPageLabel = 'Næste side';
      this.dataSource.filterPredicate =
        (data: Department, filter: string) => !filter ||
          data.name.toLowerCase().includes(filter.trim().toLowerCase()) ||
          data.manager.toLowerCase().includes(filter.trim().toLowerCase());
      setTimeout((res) => {
        loadingDialog.close();
      }, 350);
    });
  }

  /**
   * Returns all Departments
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
   * Opens dialog box and calls Delete method when it's closed
   * @param department
   */
  openDelete(department) {
    const dialogRef = this.dialog.open(DeleteDepartmentDialogComponent, {
      width: '400px',
      disableClose: true,
      data: department,
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.delete(department);
      }
    });

  }


  resetManagerPassword(department) {
    this.getTeams(department.name).subscribe((users) => {
      let manager = users.filter(user => user.role === variables.roles.manager)[0] as User;
      this.dialog.open(EditManagerDialogComponent, {
        width: '400px',
        disableClose: true,
        autoFocus: false,
        data: {user: manager}
      });
    });
  }

  /**
   * Deletes Department from DB
   * @param department
   */
  delete(department) {
    this.db.collection('departments').doc(department.id).delete();
  }

  /**
   * Opens dialog box and updates Department when it's closed
   * @param department
   */
  edit(department) {
    this.department = department.name;
    const dialogRef = this.dialog.open(EditDepartmentDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {department: department}
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let newDepartmentName = res.name;
        let oldDepartmentname = this.department;
        this.db.collection('departments').doc(department.id).update(res).then((result) => {
          this.updateDepartment(oldDepartmentname, newDepartmentName);
        });
      }
    });
  }

  /**
   * Updates Department in DB
   * @param oldDepartment
   * @param newDepartment
   */
  updateDepartment(oldDepartment, newDepartment) {
    this.db.collection('users', ref => ref.where('department', '==', oldDepartment))
      .get()
      .subscribe((users) => {
        users.forEach((user) => {
          this.db.collection('users').doc(user.id).update({department: newDepartment});
        });
      });

    this.db.collection('posters', ref => ref.where('department', '==', oldDepartment))
      .get()
      .subscribe((posters) => {
        posters.forEach((poster) => {
          this.db.collection('posters').doc(poster.id).update({department: newDepartment});
        });
      });

    this.db.collection('hungposters', ref => ref.where('department', '==', oldDepartment))
      .get()
      .subscribe((hungPosters) => {
        hungPosters.forEach((hungPoster) => {
          this.db.collection('hungposters').doc(hungPoster.id).update({department: newDepartment});
        });
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
   * Opens dialog box and calls Create method after it's closed
   */
  openCreateDepartmentDialog(): void {
    const dialogRef = this.dialog.open(CreateDepartmentDialogComponent, {
      width: '400px',
      data: {done: false, department: null, manager: null},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.createDepartment(res.departmentName, res.username, res.pass);
        const dialogRef = this.dialog.open(CreateDepartmentDialogComponent, {
          width: '400px',
          disableClose: true,
          data: {done: true, department: res.departmentName, manager: {username: res.username, password: res.pass}},
        });
        setTimeout((res) => {
          res.loading.close();
        }, 350);
      }

    });
  }

  /**
   * Creates Department in DB
   * @param departmentName
   * @param managerUsername
   * @param managerPassword
   */
  createDepartment(departmentName, managerUsername, managerPassword) {
    this.db.collection('departments')
      .add({name: departmentName, manager: managerUsername} as Department)
      .then((res) => {
        let email = (managerUsername + variables.emailSuffix);
        this.authService.afAuth.auth.createUserWithEmailAndPassword(email, '' + managerPassword).then((res) => {
          this.db.collection('users').doc(res.user.uid).set({
            username: managerUsername,
            department: departmentName,
            role: 'MANAGER'
          });
        });

        this.authService.login(this.authService.getEmail(), this.authService.getPassword()).then((res) => {
          this.router.navigate(['/departments']);
        });
      });

  }

  getTeams(department): Observable<User[]> {
    return this.db.collection('users', ref => ref.where('department', '==', department)
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
}
