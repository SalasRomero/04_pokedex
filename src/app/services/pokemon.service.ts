import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { Pokemon } from '../models/pokemon';
import { HttpResponse } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private nextUrl:string;

  constructor() { 
    this.nextUrl = 'https://pokeapi.co/api/v2/pokemon?offset=00&limit=20';
  }

  getPokemons(){
    const url = this.nextUrl;

    if(url){

      const options = {
        url,
        headers:{},
        params:{}
      };

      return CapacitorHttp.get(options)
      .then(async (response)=>{
        let pokemons:Pokemon[] = [];
        
        console.log(response);

        if(response.data){
          const results = response.data.results;
          this.nextUrl = response.data.next;

          const promises:Promise<HttpResponse>[] = [];

          for(let index = 0; index < results.length; index++){
            const pokemon = results[index];
            const urlPokemon = pokemon.url;

            const options = {
              url:urlPokemon,
              headers:{},
              params:{}
            };
            promises.push(CapacitorHttp.get(options));
          }

          await Promise.all(promises).then((responses)=>{
            for(response of responses){
              const pokemonData = response.data;
              const pokemonObjeto = new Pokemon();
              pokemonObjeto.id = pokemonData.order;
              pokemonObjeto.name = pokemonData.name;
              pokemonObjeto.type1 = pokemonData.types[0].type.name;
              if(pokemonData.types[1]){
                pokemonObjeto.type2 = pokemonData.types[1].type.name;
              }
              pokemonObjeto.sprite = pokemonData.sprites.front_default;
              pokemonObjeto.weight = pokemonData.weight/10;
              pokemonObjeto.height = pokemonData.height/10;
              pokemonObjeto.stats = pokemonData.stats;
              pokemonObjeto.abilities = pokemonData.abilities.filter(ab=> !ab.is_hidden).map(ab => ab.ability.name);

              const hiddenAbility = pokemonData.abilities.find(ab=> ab.is_hidden);

              if(hiddenAbility){
                pokemonObjeto.hiddenAbility = hiddenAbility.ability.name;
              }

              pokemons.push(pokemonObjeto);
              
            }
          });

        }

        return pokemons;
      });

    }
    return null;
  }
}
