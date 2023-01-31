import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { BossoloService } from '../services/bossolo.service';
import { CreaPartitaService } from '../services/crea-partita.service';
import { DatabaseService } from '../services/database.service';
import { PartitaDBService } from '../services/partita-db.service';
import { ProprietarioService } from '../services/proprietario.service';

@Component({
  selector: 'app-partita',
  templateUrl: './partita.page.html',
  styleUrls: ['./partita.page.scss'],
})
export class PartitaPage implements OnInit {
  codice?: string;
  userProprietario?:string;
  iniziata: boolean = false;
  
  bingoSub!: Subscription;

  @Input() bingoEvent = new EventEmitter();

  constructor(public crea: CreaPartitaService, public database: DatabaseService, 
    public auth: AuthService, public propr: ProprietarioService, public bossolo: BossoloService,
    public partita: PartitaDBService, private router: Router) {  }

  ngOnInit() {
    this.codice=this.crea.getCodiceUrl();
    this.controllaProprietario();
    this.partita.setPartita(this.codice!);
  }

  public controllaProprietario():void{
    this.database.getPartita(this.codice!).then((promise) => {
      try{
        this.userProprietario=promise.proprietario;
        //faccio nuovamente il controllo sul proprietario per evitare che refresshando la pagina perda il valore true
        //l'assegnazione non viene fatta in principio qui perché avverrebbe troppo tardi (perchè è un controllo lento) rispetto
        //alla creazione della pagina stessa
        if(this.propr.proprietario!=true){
          if(promise.proprietario==this.auth.get("user")){ 
            this.propr.proprietario=true;
          }else{
            this.propr.proprietario=false;
          }
        }
      }catch (e){
        console.log("errore"+e);
      }
    });
  };

  start(): void {
    //setto la partita a iniziata in modo che non sia più visibile nella pagina iniziale
    this.database.partitaIniziata(this.codice!);
    this.iniziata=true;
    this.bossolo.startTimer();
    this.ascoltaBingo();
  }

  finePartita(): void{
    //Stop estrazione numeri
    this.bossolo.stopTimer();
    console.log("STOOOOOOOOOOOOOOOOOOOOOP")
    //Stop ascolto vincitore partita
    this.bingoSub.unsubscribe();
    //Stop ascolto numero estratto
    //this.partita.spegniAscoltoNumero();
    //this.partita.spegniAscoltoBingo();
    //this.partita.ascoltaBingo().unsubscribe();

  }


  end(codice: string): void {
    this.database.eliminaPartita(codice);
    this.bossolo.stopTimer();
    this.router.navigate(['/tabs/tab1']);
  }

  public esci(codice: string):void{
    //chiamata al db per prendere il numero dei partecipanti
    this.database.getPartita(codice).then((promise) => {
      try{
        let numPartecipanti= promise.numPartecipanti;
        //aggiorno il numero dei partecipanti
        this.database.aggiornaPartecipanti(codice, numPartecipanti-1);
        this.router.navigate(['/tabs/tab1']);
      }catch (e){
        console.log("errore"+e);
      }
    });
  }

  ascoltaBingo(): void {
    this.bingoSub = this.partita.ascoltaBingo()
      .subscribe((value) => {
      if(value !== false){
        console.log("Qualcuno ha fatto bingo", value);
        this.finePartita();
        }
      })
  }

}
