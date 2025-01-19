import { Injectable } from '@angular/core';
import {
    Action,
    Selector,
    State,
    StateContext,
} from '@ngxs/store';
import { ProduitStateModel } from './produits-state-model';
import { AddProduit, UpdateFilter, InitAllCategories } from '../actions/produits-action';
import { ApiService } from '../api.service';

@State<ProduitStateModel>({
    name: 'produits',
    defaults: {
        produits: [],
        categories: [],
    },
})
@Injectable()
export class ProduitState {
    constructor(private apiService: ApiService) { }

    @Selector()
    static getProduits(state: ProduitStateModel) {
        return state.produits;
    }

    @Selector()
    static getAllCategories(state: ProduitStateModel) {
        return state.categories;
    }

    @Action(InitAllCategories)
    async InitAllCategories({ getState, patchState }: StateContext<ProduitStateModel>, { }: any){
        this.apiService.getProduitCategories().subscribe(
            (categories) => {
                for (let i = 0; i < categories.length; i++) {
                    categories[i] = categories[i].category;
                }
                categories = Array.from(new Set(categories));

                patchState({ categories });
            },
            (error) => console.error('Error loading user info:', error)
        );
    }

    @Action(UpdateFilter)
    async updateFilter({ getState, patchState }: StateContext<ProduitStateModel>, { payload }: any) {
        if(payload.category === 'All'){
            payload.category = '';
        }

        this.apiService.getProduitsFiltre(payload.name, payload.category).subscribe(
            (produits) => {
                patchState({ produits });
            },
            (error) => console.error('Error loading user info:', error)
        );
    }

    @Action(AddProduit)
    add({ getState, patchState }: StateContext<ProduitStateModel>, { payload }: AddProduit) {
        const state = getState();
        const produits = [...state.produits];
        produits.push(payload);
        patchState({ produits });
    }
}