import { Component } from '@angular/core';
import { CardFormComponent } from '../card-form/card-form.component';
import { CardDisplayComponent } from '../card-display/card-display.component';

@Component({
  selector: 'app-card-tab',
  imports: [CardFormComponent, CardDisplayComponent],
  templateUrl: './card-tab.component.html',
  styleUrl: './card-tab.component.css'
})
export class CardTabComponent {

}
