import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

import { getDatabase, set, ref, onValue } from "firebase/database";
import { response } from 'express';
import { HttpClient } from '@angular/common/http';
import { User } from 'firebase/auth';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  db;

  constructor(public database: DatabaseService, public http: HttpClient, private Auth:AuthService, private router: Router, private alert: AlertService) { 
    this.db = getDatabase();
  }

  ngOnInit() {
  }

  async login(value: any){
    this.database.getUser(value.username).then((promise) => {
      try{
        //controllo che la password conbaci
        if(promise.password === value.password){
          console.log("Trovato");
          this.Auth.set('user', promise.username);
          this.Auth.set('crediti', promise.crediti);     
          //prendo dal db il tibro in uso   
          this.database.getUrlTimbro(promise.timbri).then((value) => {
            this.Auth.set('timbro', value);
          })
          this.router.navigate(['/tabs/tab1']);
        } else {
          console.log("Non trovato");
          this.alert.presentAlert("User o password sbagliati, riprovare");
        }
      } catch(e){
      console.log("Non trovato");
      this.alert.presentAlert("User o password sbagliati, riprovare");
    }
    })
  }
}
