import { Injectable, signal } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    private cards = signal<Card[]>([]);
    private initialized = false;

    constructor() { }

    addCard(card: Card) {
        this.cards.update(cards => [...cards, card]);
    }

    deleteCard(card: Card) {
        this.cards.update(cards => cards.filter(c => c !== card));
    }

    get getCards() {
        return this.cards;
    }

    initializeCards() {
        if (!this.initialized) {
            this.cards.update(_ => [
                new Card('Charly', '6548108459620315', '12/25', '123'),
                new Card('Paolo', '6969696969696969', '12/26', '456'),
                new Card('Tom', '1234567890123456', '12/27', '789')]
            );
            this.initialized = true;
        }
    }
}