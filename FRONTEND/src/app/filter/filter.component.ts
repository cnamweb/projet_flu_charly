import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { Filter } from '../models/filter';
import { InitAllCategories , UpdateFilter } from '../actions/produits-action';
import { ProduitState } from '../states/produits.state';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    imports: [FormsModule, CommonModule],
    styleUrls: ['./filter.component.css']
})
export class FilterComponent {
    categories$: Observable<string[]>;

    constructor(private store: Store) {
        this.categories$ = this.store.select(ProduitState.getAllCategories);

        this.store.dispatch(new InitAllCategories());
    }
    search: string = '';
    selectedCategory: string = 'All';

    onFilterChange() {
        const filter = new Filter();
        filter.name = this.search;
        filter.category = this.selectedCategory;
        this.store.dispatch(new UpdateFilter(filter));
    }
}