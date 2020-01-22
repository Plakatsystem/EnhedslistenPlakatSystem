import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HungPoster } from '../entities/hung-poster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { TakedownHungPosterDialogComponent } from '../takedown-hung-poster-dialog/takedown-hung-poster-dialog.component';
import {} from 'googlemaps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
  @ViewChild('map', {static: true}) mapElement: any;
  customMap;
  infoWindow;
  posterName;
  hungPoster;
  amount: number;
  showCenter = false;
  allMarkers = [];
  role = this.authService.getUserData().role;

  constructor(private db: AngularFirestore,
              public router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private datePipe: DatePipe,
              private dialog: MatDialog) {
  }

  /**
   * Calls different methods depending on the URL
   */
  ngOnInit() {
    this.initMap();
    if (this.router.url.includes('edit-hung-poster/map/') || this.router.url.includes('map/showinfo/')) {
      this.getHungPosterLocation();
    } else {
      this.getCurrentLocation();
    }
    this.showHungPosters();
    if (this.router.url.includes('hang-poster/map') || this.router.url.includes('edit-hung-poster/map')) {
      this.route.params.subscribe(event => {
        this.showCenter = true;
        this.posterName = event.name;
        this.amount = +event.amount;
        this.showCenter = true;
      });
    }
  }

  /**
   * Initializes Google Map with custom features
   */
  initMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 56.107241, lng: 11.045768},
      zoom: 7,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      gestureHandling: 'greedy',
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
      },
      tilt: 0,
      rotateControl: false,
      styles: [
        {
          'elementType': 'labels',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'administrative',
          'elementType': 'geometry',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'administrative.country',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'administrative.land_parcel',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'administrative.locality',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'administrative.neighborhood',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'administrative.province',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'poi',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'poi.attraction',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'poi.government',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'poi.medical',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'poi.park',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'poi.sports_complex',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'poi.place_of_worship',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'road',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'road',
          'elementType': 'labels.icon',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'road.arterial',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'road.highway',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'road.highway.controlled_access',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'road.local',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'transit',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'transit.line',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'transit.station',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'transit.station.airport',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'transit.station.bus',
          'stylers': [
            {
              'visibility': 'off'
            }
          ]
        },
        {
          'featureType': 'transit.station.rail',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        },
        {
          'featureType': 'water',
          'stylers': [
            {
              'visibility': 'on'
            }
          ]
        }
      ]
    });
    this.customMap = map;
    const infoWindow = new google.maps.InfoWindow();
    this.infoWindow = infoWindow;
  }

  /**
   * Centers map to Hung Poster transferred in params
   */
  getHungPosterLocation() {
    let map = this.customMap;
    this.route.params.subscribe(params => {
      this.loadHungPosters().subscribe((res) => {
        let hungPosters = res as HungPoster[];
        for (let i = 0; i < hungPosters.length; i++) {
          if (hungPosters[i].id === params.id) {
            this.hungPoster = hungPosters[i];
            const pos = {
              lat: Number(hungPosters[i].location.lat),
              lng: Number(hungPosters[i].location.lng)
            };
            map.setZoom(16);
            map.setCenter(pos);
          }
        }
      });
    });
  }

  /**
   * Centers map to users current location using Geolocation
   */
  getCurrentLocation() {
    let map = this.customMap;
    let infoWindow = this.infoWindow;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        let myLocationMarker = new google.maps.Marker({
          position: new google.maps.LatLng(pos),
          map: map,
          icon: {
            url: '/assets/media/location.png',
            fillColor: '#00ccbb',
            fillOpacity: 1,
            strokeColor: '',
            strokeWeight: 2,
            labelOrigin: new google.maps.Point(7, 12),
            anchor: new google.maps.Point(13, 13)
          },
          zIndex: 5,
        });
        map.setZoom(16);
        infoWindow.open(map);
        map.setCenter(pos);
      }, function() {
        this.handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      this.handleLocationError(false, infoWindow, map.getCenter(), map);
    }
  }

  /**
   * Error handling for Geolocation
   * @param browserHasGeolocation
   * @param infoWindow
   * @param pos
   * @param map
   */
  handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
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

  /**
   * Places marker on map with X Hung Posters info
   * @param hungPosterInfo
   */
  placeMarker(hungPosterInfo) {
    var map = this.customMap;
    let time = hungPosterInfo.time.toDate();
    time = this.datePipe.transform(time, 'dd-MM-yyyy Kl: HH:mm');
    let color = '#703290';
    if (hungPosterInfo.department === this.authService.getUserData().department) {
      color = '#D0004D';
    }
    if (hungPosterInfo.teamName === this.authService.getUserData().username) {
      color = '#F18A2D';
    }
    let marker = new google.maps.Marker({
      position: new google.maps.LatLng(hungPosterInfo.location.lat, hungPosterInfo.location.lng),
      map: this.customMap,
      title: hungPosterInfo.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: 'black',
        strokeWeight: 0.2,
        labelOrigin: new google.maps.Point(0, 1.5),
        scale: 10
      },
      zIndex: 10,
    });
    this.allMarkers.push(marker);
    // Creates different infowindows with different layouts
    let infoNoButton = '<div>' +
      '<h2>' + hungPosterInfo.posterName + '</h2>' +
      '<p>Antal: ' + hungPosterInfo.amount + '</p>' +
      '<p>Opsat d. ' + time + '</p>' +
      '<p>Opsat af: ' + hungPosterInfo.teamName + '</p>' +
      '<p>Afdeling: ' + hungPosterInfo.department + '</p>' +
      '</div>';

    let infoWButton = '<div>' +
      '<h2>' + hungPosterInfo.posterName + '</h2>' +
      '<p>Antal: ' + hungPosterInfo.amount + '</p>' +
      '<p>Opsat d. ' + time + '</p>' +
      '<p>Opsat af: ' + hungPosterInfo.teamName + '</p>' +
      '<p>Afdeling: ' + hungPosterInfo.department + '</p>' +
      '<button class="infoWindowButton" style="outline:none;" onclick="document.getElementById(\'editButton\').click();"><i class="infoWindowIcon material-icons">edit</i>REDIGER</button>' +
      '</div>';

    let infoDeleteButton = '<div>' +
      '<h2>' + hungPosterInfo.posterName + '</h2>' +
      '<p>Antal: ' + hungPosterInfo.amount + '</p>' +
      '<p>Opsat d. ' + time + '</p>' +
      '<p>Opsat af: ' + hungPosterInfo.teamName + '</p>' +
      '<p>Afdeling: ' + hungPosterInfo.department + '</p>' +
      '<button class="infoWindowButton" style="outline:none;" onclick="document.getElementById(\'deleteButton\').click();"><i class="infoWindowIcon material-icons">arrow_downward</i>NEDTAG</button>' +
      '</div>';
    // Triggers different infowindows depending on role and URLs
    if (this.router.url.match('/map') && this.authService.getUserData().role === 'MANAGER' && hungPosterInfo.department === this.authService.getUserData().department) {
      let infoWindow = this.infoWindow;
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.title = hungPosterInfo.id;
        infoWindow.setContent(infoWButton);
        infoWindow.open(map, marker);
      });
    } else if (this.router.url.match('/map')) {
      let infoWindow = this.infoWindow;
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.title = hungPosterInfo.id;
        infoWindow.setContent(infoNoButton);
        infoWindow.open(map, marker);
      });
    } else if (this.router.url.match('/edit-hung-poster') && (hungPosterInfo.teamName !== this.authService.getUserData().username && this.authService.getUserData().username.includes('O'))) {
      let infoWindow = this.infoWindow;
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.title = hungPosterInfo.id;
        infoWindow.setContent(infoNoButton);
        infoWindow.open(map, marker);
      });
    } else if (this.authService.getUserData().username.includes('N')) {
      let infoWindow = this.infoWindow;
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.title = hungPosterInfo.id;
        infoWindow.setContent(infoDeleteButton);
        infoWindow.open(map, marker);
      });
    } else {
      let infoWindow = this.infoWindow;
      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.close();
        infoWindow.title = hungPosterInfo.id;
        infoWindow.setContent(infoWButton);
        infoWindow.open(map, marker);
      });
    }
    if (this.router.url.includes('map/showinfo/') && hungPosterInfo.id === this.hungPoster.id) {
      let infoWindow = this.infoWindow;
      infoWindow.setContent(infoNoButton);
      infoWindow.open(map, marker);
    }
  }

  /**
   * Places markers of all Hung Posters
   */
  showHungPosters() {
    this.loadHungPosters().subscribe((res) => {
      let hungPosters = res as HungPoster[];
      for (let i = 0; i < hungPosters.length; i++) {
        if (this.router.url.includes('edit-hung-poster/map/')) {
          if (this.hungPoster.id !== hungPosters[i].id) {
            this.placeMarker(hungPosters[i]);
          }
        } else {
          this.placeMarker(hungPosters[i]);
        }
      }
    });
  }

  /**
   * Updates Hung Poster in DB
   */
  updatePoster() {
    let map = this.customMap;
    this.db.collection('hungposters').doc(this.hungPoster.id).update({
      location: {lat: map.getCenter().lat().toString(), lng: map.getCenter().lng().toString()},
    });
    this.router.navigate(['/map/showinfo/' + this.hungPoster.id]);
  }

  /**
   * Creates Hung Poster in DB
   */
  hangPoster() {
    let map = this.customMap;
    this.db.collection('hungposters')
      .add({
        posterName: this.posterName,
        location: {lat: map.getCenter().lat().toString(), lng: map.getCenter().lng().toString()},
        amount: this.amount,
        time: new Date(),
        teamName: this.authService.getUserData().username,
        department: this.authService.getUserData().department
      } as HungPoster)
      .then(r => {
        this.router.navigate(['/map/showinfo/' + r.id]);
      });
  }

  /**
   * Navigates with current infowindows Hung Poster ID
   */
  editHungPoster() {
    this.router.navigate(['/edit-hung-poster/' + this.infoWindow.title]);
  }

  /**
   * Delete poster from DB and resets markers
   */
  deletePoster() {
    this.getHungPosters().subscribe((hungposters) => {
      for (let i = 0; i < hungposters.length; i++) {
        if (hungposters[i].id == this.infoWindow.title) {
          let dialog = this.dialog.open(TakedownHungPosterDialogComponent, {
            width: '100%',
            // minHeight: '100%',
            minWidth: '100%',
            disableClose: true,
            data: {hungPoster: hungposters[i]}
          });
          dialog.afterClosed().subscribe((res) => {
            this.allMarkers.forEach((marker) => {
              marker.setMap(null);
            });
            this.showHungPosters();
          });

        }
      }
    });
  }

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
}



