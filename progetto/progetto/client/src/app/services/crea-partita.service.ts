import { Injectable } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { PartitaData } from '../interfaces/PartitaData';

import { getDatabase, set, ref, onValue } from "firebase/database";
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { AuthService } from './auth.service';
import { Partita } from '../interfaces/Partita';


@Injectable({
  providedIn: 'root'
})
export class CreaPartitaService {
  db;
  pubblica?: boolean;
  codice: any= "";
  username = JSON.parse(localStorage.getItem('user')!);

  constructor(public database: DatabaseService, private route: ActivatedRoute, private router: Router, private Auth:AuthService ) {
    this.db = getDatabase();
  }

  public creaPartita(proprietario: string, pubblica: boolean, cod: string): any{
    //let codice= this.route.snapshot.paramMap.get('codice'); 
    let codice= cod;
    let iniziata = false;
    let numPartecipanti: number= 1;
    let messaggi:[]=[];
    let ultimoNumero= -1;
    let cinquina = false;
    let bingo= false;
    let premioBingo = 1;
    let premioCinquina = 1;
    let numeriEstratti = 0;
    let datiPartita: Partita= {ultimoNumero, cinquina, bingo, premioBingo, premioCinquina, numeriEstratti};
    let partita: PartitaData ={
      pubblica, iniziata, codice, numPartecipanti, proprietario, messaggi, datiPartita
    };
    this.database.creaPartita(partita);
    this.database.chat(codice, proprietario);
  }


  //Crea partita del DB
  async creaPartitaDB(partita: boolean): Promise<void> {
    console.log("1");
    this.codice=this.creaCodice();
    this.creaPartita(this.username,partita,this.codice);
  }

  
  //Crea codice
  creaCodice(): any{
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += this.getRandomChar();
    }
    //controllo sul db che il codice generato non sia già stato salvato nel db
    //il controllo serve perché se no sovrascrive i dati dell'altra partita
    //this.database.getPartita(result).then((value) => {

      const partita = ref(this.db, 'partita/'+ result);
      onValue(partita, (snapshot) => {
        try{
          let p = snapshot.val();
          if(p != null){
            console.log("Trovato");
            return this.creaCodice();
          } else {
            console.log("NOn trovato");
          }
        } catch(e){
          console.log("alternativa");
        }
      });
      return result;
    //});
  }

      


    /*
    console.log("Partita", value);
      if(value===null || value === undefined){
        console.log("we"+ result);
        return result;
      } else 
        return this.creaCodice();
    })
    */


  getRandomChar(): string {
    const code = Math.floor(Math.random() * (90 - 65 + 1)) + 65;
    return String.fromCharCode(code);
  }


  //Setta la partita in modalità pubblica
  setPublic():void {
    this.pubblica = true;
    this.creaPartitaDB(true);
    this.router.navigate(['partita/'+this.codice]);
  }
  
  //Setta la partita in modalità privata
  setPrivate(): void{
    this.router.navigate(['partita/'+this.codice]);
    this.pubblica = false;
    this.creaPartitaDB(false);
  }

  //metodo per prendere il codice della partita da params
  getCodiceUrl() : any{
    let url=("url"+this.router.parseUrl(this.router.url));
    let arrayUrl:string[];
    arrayUrl=url.split('/');
    //return this.route.snapshot.paramMap.get('codice');
    return arrayUrl[2];
  }
}
