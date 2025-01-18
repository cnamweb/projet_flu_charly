export class Card {
  cardHolder: string = '';
  cardNumber: string = '';
  expirationDate: string = '';
  securityCode: string = '';
  constructor(cardHolder: string, cardNumber: string, expirationDate: string, securityCode: string) {
    this.cardHolder = cardHolder;
    this.cardNumber = cardNumber;
    this.expirationDate = expirationDate;
    this.securityCode = securityCode;
  }
}