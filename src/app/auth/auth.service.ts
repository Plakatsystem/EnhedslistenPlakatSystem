import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../entities/user';
import {variables} from '../../assets/variables';
import {LoadingDialogComponent} from '../loading-dialog/loading-dialog.component';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: User = {username: '', role: '', department: ''};
  password: string;
  email: string;
  roles = variables.roles;

  constructor(public afAuth: AngularFireAuth,
              private router: Router,
              private db: AngularFirestore,
              private dialog: MatDialog) {
  }

  login(username, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(username, password);
  }

  signOut() {
    this.userData = {username: '', role: '', department: ''};
    this.email = null;
    this.password = null;
    this.afAuth.auth.signOut();
  }

  getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  getUserData(): User {
    return this.userData;
  }

  getPassword() {
    return this.password;
  }

  getEmail() {
    return this.email;
  }

  loadUserData() {
    let loadingDialog = this.dialog.open(LoadingDialogComponent, {
      width: '400px',
      disableClose: true
    });

    let sub = this.db.collection('users').doc(this.afAuth.auth.currentUser.uid).valueChanges().subscribe((user) => {
      this.userData = user as User;
      loadingDialog.close();
      this.router.navigate(['menu']);
    });
  }

  /**
   * Creates user with email/password and adds email suffix
   * @param username
   * @param password
   */
  createUser(username, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(username + variables.emailSuffix, password);
    this.login(this.email, this.password).then((res) => {
      console.log('User created');
    });

  }


}
