import { Component } from '@angular/core';
import { Timbro } from '../interfaces/Timbro';
import { User } from '../interfaces/User';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { TimbriService } from '../services/timbri.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  user?: User;
  username: string | null = "NO";
  timbri: Timbro[] = []

  constructor(public Auth: AuthService, public database: DatabaseService, public timbro: TimbriService, public auth: AuthService) {
    let username = this.auth.get("user");
    //carico dati dell'utente
    database.getUser(username).then((value) => {
      let u: User = {
        username: value.username,
        cognome: value.cognome,
        nome: value.nome,
        mail: value.mail,
        password: value.password,
        crediti: value.crediti,
        timbri: value.timbri,
        stats: {
          partiteFatte: this.isZero(value.stats.partiteFatte),
          bingo: this.isZero(value.stats.bingo),
          cinquine: this.isZero(value.stats.cinquina),
          superbingo: this.isZero(value.stats.superbingo),
        },
        codiceTimbri: value.codiceTimbri,
      }
      this.user = u;
    })
    //prendo i timbri dell'utente
    timbro.appartiene().then((value: any) => {
      this.timbri = value;
    })
  }
  
  ngOnInit() {
    console.log("USER", this.user?.username);
  }

  isZero(value: any): any{
    if(value === undefined){
      return 0;
    } else {
      return value;
    }
  }

  logout(){
    this.Auth.delete("user");
    this.Auth.delete("timbro");
    this.Auth.delete("crediti");
    window.location.reload();
  }

}
