import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './views/login/login.component';
import { UserSummaryComponent } from './views/users/user-summary/user-summary.component';
import { UserAddComponent } from './views/users/user-add/user-add.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../../src/app/utilities/shared-components/components.module';
import { DatePipe } from '@angular/common';
import { UserUpdateComponent } from './views/users/user-update/user-update.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user-Summary', component: UserSummaryComponent },
  { path: 'user-Add', component: UserAddComponent },
  { path: 'user-Update', component: UserUpdateComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserSummaryComponent,
    UserAddComponent,
    UserUpdateComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ComponentsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
