import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MenuComponent } from './menu/menu.component';
import { PostersComponent } from './posters/posters.component';
import { HangPosterComponent } from './hang-poster/hang-poster.component';
import { MapComponent } from './map/map.component';
import { TeamsComponent } from './teams/teams.component';
import { DepartmentsComponent } from './departments/departments.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design/material-design.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { CreateDepartmentDialogComponent } from './create-department-dialog/create-department-dialog.component';
import { DeleteDepartmentDialogComponent } from './delete-department-dialog/delete-department-dialog.component';
import { CreateTeamDialogComponent } from './create-team-dialog/create-team-dialog.component';
import { DeleteTeamDialogComponent } from './delete-team-dialog/delete-team-dialog.component';
import { CreateTeamsDialogComponent } from './create-teams-dialog/create-teams-dialog.component';
import { CreatePosterDialogComponent } from './create-poster-dialog/create-poster-dialog.component';
import { DeletePosterDialogComponent } from './delete-poster-dialog/delete-poster-dialog.component';
import { EditPosterDialogComponent } from './edit-poster-dialog/edit-poster-dialog.component';
import { EditDepartmentDialogComponent } from './edit-department-dialog/edit-department-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { EditHungPosterComponent } from './edit-hung-poster/edit-hung-poster.component';
import { EditTeamDialogComponent } from './edit-team-dialog/edit-team-dialog.component';
import { DeleteHungPosterDialogComponent } from './delete-hung-poster-dialog/delete-hung-poster-dialog.component';
import { LoadingDialogComponent } from './loading-dialog/loading-dialog.component';
import { EditManagerDialogComponent } from './edit-manager-dialog/edit-manager-dialog.component';
import { GuideDialogComponent } from './guide-dialog/guide-dialog.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { TakedownHungPosterDialogComponent } from './takedown-hung-poster-dialog/takedown-hung-poster-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    MenuComponent,
    PostersComponent,
    HangPosterComponent,
    MapComponent,
    TeamsComponent,
    DepartmentsComponent,
    DeleteDepartmentDialogComponent,
    CreateDepartmentDialogComponent,
    CreateTeamDialogComponent,
    DeleteTeamDialogComponent,
    CreateTeamsDialogComponent,
    CreatePosterDialogComponent,
    DeletePosterDialogComponent,
    EditPosterDialogComponent,
    EditDepartmentDialogComponent,
    EditHungPosterComponent,
    EditTeamDialogComponent,
    DeleteHungPosterDialogComponent,
    LoadingDialogComponent,
    EditManagerDialogComponent,
    GuideDialogComponent,
    TakedownHungPosterDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    OverlayModule,
    MatDialogModule,
    MatSelectModule,
    MatSortModule,
    MatTooltipModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    PdfViewerModule,
    MatPaginatorModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteTeamDialogComponent,
    CreateTeamsDialogComponent,
    CreateDepartmentDialogComponent,
    DeleteDepartmentDialogComponent,
    CreateTeamDialogComponent,
    DeleteTeamDialogComponent,
    CreateTeamsDialogComponent,
    CreatePosterDialogComponent,
    DeletePosterDialogComponent,
    EditPosterDialogComponent,
    EditDepartmentDialogComponent,
    EditTeamDialogComponent,
    DeleteHungPosterDialogComponent,
    LoadingDialogComponent,
    EditManagerDialogComponent,
    GuideDialogComponent,
    TakedownHungPosterDialogComponent
  ]
})
export class AppModule {
}
