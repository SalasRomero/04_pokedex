import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { Pokemon } from 'src/app/models/pokemon';

@Component({
  selector: 'app-detail-pokemon',
  templateUrl: './detail-pokemon.page.html',
  styleUrls: ['./detail-pokemon.page.scss'],
})
export class DetailPokemonPage  {

  public pokemon:Pokemon;

  constructor(
    private navParam:NavParams,
    private navCtrl:NavController
  ) {
    this.pokemon = this.navParam.data["pokemon"];
    console.log(this.pokemon);
   }


  goBack(){
    this.navCtrl.pop();
  }

}
