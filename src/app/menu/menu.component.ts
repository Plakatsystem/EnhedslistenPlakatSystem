import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import {GuideDialogComponent} from '../guide-dialog/guide-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(
              public authService: AuthService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  openGuideDialog() {
    const dialogRef = this.dialog.open(GuideDialogComponent, {
      minWidth: '80%',
      data: {},
      disableClose: true,
      height: '95%',
      // minWidth: '100%',
      maxWidth: '100%',
      maxHeight:'95%',
      autoFocus:false,
    });
  }

}
