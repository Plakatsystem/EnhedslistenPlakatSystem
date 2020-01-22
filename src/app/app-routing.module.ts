import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MenuComponent} from './menu/menu.component';
import {TeamsComponent} from './teams/teams.component';
import {PostersComponent} from './posters/posters.component';
import {MapComponent} from './map/map.component';
import {DepartmentsComponent} from './departments/departments.component';
import {HangPosterComponent} from './hang-poster/hang-poster.component';
import {EditHungPosterComponent} from './edit-hung-poster/edit-hung-poster.component';
import {variables} from '../assets/variables';
import {FirebaseGuard} from './auth/firebase.guard';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'menu', component: MenuComponent,data: {roles: [variables.roles.admin, variables.roles.manager, variables.roles.team]}, canActivate: [FirebaseGuard]},
  {path: 'departments', component: DepartmentsComponent,  data: {roles: [variables.roles.admin]}, canActivate: [FirebaseGuard]},
  {path: 'teams', component: TeamsComponent, data: {roles: [variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: 'posters', component: PostersComponent, data: {roles: [variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: 'hang-poster', component: HangPosterComponent, data: {roles: [variables.roles.team]}, canActivate: [FirebaseGuard], children: [
      {path: 'map/:name/:amount', component: MapComponent, data: {roles: [variables.roles.team]}, canActivate: [FirebaseGuard]}
    ]},
  {path: 'edit-hung-poster', component: MapComponent, data: {roles: [variables.roles.team, variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: 'edit-hung-poster/:id', component: EditHungPosterComponent, data: {roles: [variables.roles.team, variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: 'edit-hung-poster/map/:id', component: MapComponent, data: {roles: [variables.roles.team, variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: 'map', component: MapComponent, data: {roles: [variables.roles.team, variables.roles.manager, variables.roles.admin]}, canActivate: [FirebaseGuard]},
  {path: 'map/showinfo/:id', component: MapComponent, data: {roles: [variables.roles.team, variables.roles.manager]}, canActivate: [FirebaseGuard]},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
