import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(public auth: AuthService, public router: Router, private location: Location) {
  }

  ngOnInit() {
  }

  /**
   * Navigation for every back button click
   */
  goBack() {
    let url = this.router.url;
    if (url === '/teams') {
      this.router.navigate(['/menu']);
    } else if (url === '/posters') {
      this.router.navigate(['/menu']);
    } else if (url === '/map') {
      this.router.navigate(['/menu']);
    } else if (url === '/hang-poster') {
      this.router.navigate(['/menu']);
    } else if (url.includes('hang-poster/map/')) {
      this.location.back();
    } else if (url.includes('map/showinfo/')) {
      this.router.navigate(['/menu']);
    } else if (url.includes('edit-hung-poster/map/')) {
      this.location.back();
    } else if (url === '/edit-hung-poster') {
      this.router.navigate(['/menu']);
    } else if (url.includes('edit-hung-poster/')) {
      this.router.navigate(['/edit-hung-poster']);
    } else if (url.includes('departments')) {
      this.router.navigate(['/menu']);
    }
  }
}
