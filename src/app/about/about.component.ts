import { Component } from '@angular/core';
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent],
})
export class AboutComponent {
  constructor() {}
}
