import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user/user';
import { catchError, Observable, retry } from 'rxjs';
import { UserAdd } from '../models/user/userAdd';
import { UserUpdate } from '../models/user/userUpdate';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  readonly baseURL = 'https://localhost:44374';

  constructor(private http: HttpClient) { }

  getUserLogin(loginUser: any): Observable<any> {
    return this.http
      .post<any>(this.baseURL + '/api/user/login', loginUser);
  }

  getUsers() {
    return this.http
      .get<any>(this.baseURL + '/api/user');
  }

  getUser(id: string) {
    var urlRaw1 = this.baseURL + '/api/user/' + id;
    var urlRaw2 = urlRaw1.replace('"', '');
    var url = urlRaw2.replace('"', '');

    return this.http
      .get<any>(url);
  }

  createUser(user: UserAdd) {
    return this.http
      .post<any>(this.baseURL + '/api/user', user);

  }
  updateUser(user: UserUpdate) {
    return this.http
      .put<any>(this.baseURL + '/api/user', user);
  }

  deleteUser(id: string) {
    var urlRaw1 = this.baseURL + '/api/user/' + id;
    var urlRaw2 = urlRaw1.replace('"', '');
    var url = urlRaw2.replace('"', '');

    return this.http
      .delete<any>(url);
  }

}






// createWorkshop(workshopObj: any) {
//   return this.http
//       .post<WorkshopsCreate>(
//           this.apiURL + '/workshop',
//           JSON.stringify(workshopObj),
//           this.httpOptions
//       )
//       .pipe(retry(4), catchError(this.handleError));
// }