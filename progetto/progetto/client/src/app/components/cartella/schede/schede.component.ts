import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ControlloCreditiService } from 'src/app/services/controllo-crediti.service';
import { CreaPartitaService } from 'src/app/services/crea-partita.service';
import { PartitaDBService } from 'src/app/services/partita-db.service';

@Component({
  selector: 'app-schede',
  templateUrl: './schede.component.html',
  styleUrls: ['./schede.component.scss'],
})
export class SchedeComponent implements OnInit {
  @Input() iniziata?: boolean;
  @Input() finePartita: boolean = false;
  @Input() compra?: boolean;

  @Output() schede = new EventEmitter<number>()

  numeroSchede: number[] = [];
  ns: boolean= true;  //se è false vuol dire che si è raggiunto il numero massimo di schede comprabili
  bingo: boolean = true;
  cinquina: boolean = true;

  cinquinaDichiarata: boolean = false; //quando qualcuno dichiara cinquina questa viene settata a true
  cinquinaSub!: Subscription;

  codice: string = this.crea.getCodiceUrl();

  aiutiBool: boolean = false;

  constructor(public partita: PartitaDBService, private Auth:AuthService, public crea: CreaPartitaService, 
    public controlloCrediti: ControlloCreditiService, public alert: AlertService) { }

  ngOnInit() {
    this.compraScheda();
    this.ascoltaCinquina();
  }

  async compraScheda(): Promise<any>{
    if(this.controlloCrediti.autorizzaOperazione(1)){
      this.numeroSchede.push(0);
      this.partita.incrementaMontepremi(this.codice);
      if(this.numeroSchede.length==3){
        this.ns= false;
      }
    } else {
      if(await this.alert.alertCompraCrediti()){
        this.compraScheda();
      }
    }
    this.schede.emit(this.numeroSchede.length);
  }

  abilitaBingo(value: any): void {
    console.log("Bingo abilitato")
    this.bingo = value;
  }

  abilitaCinquina(value: any): void {
    if(!this.cinquinaDichiarata && this.cinquina){
      console.log("Cinquina abilitata")
      this.cinquina = value;
    }
  }

  ascoltaCinquina(): void {
    this.cinquinaSub = this.partita.ascoltaCinquina(this.codice).subscribe((value) => {
      if(value!=false){
        this.cinquinaDichiarata = true;
        this.cinquina = true;
        this.cinquinaSub.unsubscribe();
      }
    })
  }

  fineCinquina(): void {
    console.log("FINE CINQUINA");
    //Avverte il DB che è stato effettuata cinquina
    this.partita.dichiaraCinquina(this.Auth.get('user'), this.codice);
  }

  fineBingo(): void {
    this.iniziata=false;
    this.compra=false;
    console.log("FINE PARTITA")
    //Avverte il DB che è stato effettuato Bingo
    this.partita.dichiaraBingo(this.Auth.get('user'), this.codice);
  }

  //Metodo per abilitare gli aiuti
  aiuti(event: any){
    this.aiutiBool = event.detail.checked;
  }
}
