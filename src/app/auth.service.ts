import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private api = "https://localhost:3000/users/";
  private api = "http://127.0.0.1:3000/users/";
  private loggedUser: any;
  private userSub = new Subject();

  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient) {
    
  }

  getAllUser() {
    this.http.get(this.api, this.httpOptions).subscribe(
      (res) => console.log(res)
    );
  }

  updateUser(id: number, user: any) {
    return this.http.patch(`${this.api}${id}`, user, this.httpOptions);
  }

  getLoggedUser() {
    return this.userSub;
  }

  isAdmin() {
    const id = JSON.parse(localStorage.getItem('loggedUser')!).ID;
    console.log(id);
    return this.http.get(this.api + "isAdmin/" + id, this.httpOptions)
  }

  sadmin(user:any) {
    const body:any = {}
    body.isAdmin = 1
    console.log("User",user);

    this.http.patch(this.api+"sadmin-update-profile/" + user.ID, user, this.httpOptions).subscribe(
      (res)=>console.log(res)
    )
  }

  deleteUser(userID: number) {

    this.http.delete(this.api + userID, this.httpOptions).subscribe(
      (res) => console.log(res)
    );
  }


  signIn(email: string, password: string) {
    let body = {
      email: email,
      password: password
    };
  
    this.http.post(this.api + "login", body, this.httpOptions).subscribe(
      {
        next: (res) => {
          console.log(res);
          this.loggedUser = res;
          localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
          this.userSub.next(this.loggedUser);
        },
        error: (err) => {
          console.log(err);
          this.loggedUser = null;
          this.userSub.next(this.loggedUser);
        }
      }
    );
  }

  signUp(first_name: string, last_name: string, gender: string, email: string, address: string, phone_number: string, password: string) {
    let body = {
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      email: email,
      address: address,
      phone_number: phone_number,
      password: password
    };

    this.http.post(this.api + "register", body).subscribe(
      {
        next: (res) => console.log(res),
        error: (err) => console.log(err)
      }
    );
  }

  getSecret() {
    if (this.loggedUser) {
      this.http.get(this.api + "secretdata", this.httpOptions).subscribe(
        {
          next: (res) => console.log(res),
          error: (err) => console.log(err)
        }
      );
    }
  }

  logout() {
    console.log('Logout function called');
    this.http.post(this.api + "logout", {}, this.httpOptions).subscribe(
    
      {
        next: (res) => {
          console.log(res);
          this.loggedUser = null;
          this.userSub.next(null);
          localStorage.removeItem('loggedUser');
          this.userSub.next(this.loggedUser);
        },
        error: (err) => console.log(err)
      }
    );
  }

  

}


