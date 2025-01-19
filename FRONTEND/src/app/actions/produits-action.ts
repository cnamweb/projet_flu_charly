import { Produit } from '../models/produit';
import { Filter } from '../models/filter';

export class UpdateFilter {
  static readonly type = '[Produits] Update Filter';
  constructor(public payload: Filter) {}
}

export class AddProduit {
  static readonly type = '[Produits] Add Produit';
  constructor(public payload: Produit) {}
}

export class InitAllCategories {
  static readonly type = '[Produits] Get All Categories';
  constructor() {}
}