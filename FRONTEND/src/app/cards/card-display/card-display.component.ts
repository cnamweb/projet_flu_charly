import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../card.service';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-display.component.html',
  styleUrl: './card-display.component.css'
})
export class CardDisplayComponent {
  constructor(private cardService: CardService) {
    this.cardService.initializeCards();
  }

  deleteCard(card: Card) {
    this.cardService.deleteCard(card);
  }

  get cards() {
    return this.cardService.getCards;
  }
}
