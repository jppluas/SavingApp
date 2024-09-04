import { Component, Input, OnInit } from '@angular/core';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-card-saldo',
  templateUrl: './card-saldo.component.html',
  styleUrls: ['./card-saldo.component.scss'],
  imports: [
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonCol,
    IonGrid,
    IonRow,
    IonButton,
  ],
  standalone: true,
})
export class CardSaldoComponent implements OnInit {
  @Input() titulo: string = '';
  @Input() dinero: number = 0;
  @Input() diasRestantes: number = 0;
  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}
}
