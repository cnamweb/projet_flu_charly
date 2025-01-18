import { Component, OnInit, Signal, WritableSignal } from '@angular/core';
import { signal, computed, effect } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CardService } from '../card.service';
import { Card } from '../../models/card';

@Component({
  selector: 'app-card-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './card-form.component.html',
  styleUrl: './card-form.component.css'
})
export class CardFormComponent implements OnInit {
  cardForm: FormGroup;  

  constructor(private formBuilder: FormBuilder, private cardService: CardService) {
    this.cardForm = this.formBuilder.group({
      cardHolder: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expirationDate: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/[0-9]{2}$')]],
      securityCode: ['', [Validators.required, Validators.pattern('^[0-9]{3}$')]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.cardForm.valid) {
      const card = new Card(this.cardForm.value.cardHolder, 
        this.cardForm.value.cardNumber, this.cardForm.value.expirationDate, this.cardForm.value.securityCode);
      this.cardService.addCard(card);
      console.log('Card added:', this.cardForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
