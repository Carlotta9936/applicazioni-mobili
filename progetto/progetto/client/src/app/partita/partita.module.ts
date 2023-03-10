import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PartitaPageRoutingModule } from './partita-routing.module';

import { PartitaPage } from './partita.page';
import { CasellaComponent } from '../components/cartella/casella/casella.component';
import { SchedaComponent } from '../components/cartella/scheda/scheda.component';
import { SchedeComponent } from '../components/cartella/schede/schede.component';
import { CellaComponent } from '../components/tab/cella/cella.component';
import { TabelloneComponent } from '../components/tab/tabellone/tabellone.component';
import { ChatComponent } from '../components/chat/chat.component';
import { CinquinaComponent } from '../components/cinquina/cinquina.component';
import { SchermataVittoriaComponent } from '../components/schermata-vittoria/schermata-vittoria.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PartitaPageRoutingModule
  ],
  declarations: [PartitaPage, SchedeComponent, SchedaComponent, CasellaComponent, TabelloneComponent, CellaComponent, ChatComponent, CinquinaComponent, SchermataVittoriaComponent]
})
export class PartitaPageModule {}
