import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Database, ref, set, update, push } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon,
  IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
  IonCol, IonRow, IonSelectOption, IonSelect, IonButtons
} from '@ionic/angular/standalone';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-finance-modal',
  templateUrl: './finance-modal.component.html',
  styleUrls: ['./finance-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon,
    IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle,
    IonCol, IonRow, IonSelectOption, IonSelect, IonButtons
  ],
})
export class FinanceModalComponent implements OnInit {
  userId!: string;
  currentMonthYear!: string;
  type!: string;
  period: boolean | null = null;
  item: any = null;
  id: string | null = null;

  data = { categoria: '', monto: 0, dia: 0, descripcion: '' };
  categoriasGasto = ['Alimentos', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Alquiler'];
  categoriasIngreso = ['Salario', 'Freelance', 'Inversiones', 'Regalos', 'Otros'];

  constructor(private route: ActivatedRoute, private router: Router, private db: Database, private alertCtrl: AlertController) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.currentMonthYear = params['currentMonthYear'];
      this.type = params['type'];
      this.period = params['period'] === 'true'; // Convertir de string a booleano
      this.item = params['item'] ? JSON.parse(params['item']) : null;
      this.id = params['id'];
      
      if (this.item) {
        this.data = { ...this.item };
      }
    });
  }


  async saveRecurring() {
    if (this.validateFields()) {
      if (this.item && this.id) {
        await this.editRecurring();
      } else {
        await this.createRecurring();
      }
    }
  }

  async saveMonthly() {
    if (this.validateFields()) {
      if (this.item && this.id) {
        await this.editMonthly();
      } else {
        await this.createMonthly();
      }
    }
  }

  validateFields(): boolean {
    if (!this.data.categoria || !this.data.monto || !this.data.dia || !this.data.descripcion) {
      this.showAlert('Error', 'Todos los campos deben estar llenos.');
      return false;
    }
    return true;
  }

  async createRecurring() {
    const path = `usuarios/${this.userId}/entradasRecurrentes/${this.type}`;
    const refToNewItem = push(ref(this.db, path)); // Genera una nueva referencia con un ID único
    await set(refToNewItem, this.data); // Guarda los datos en la nueva referencia

    this.close();  
  }

  async editRecurring() {
    const path = `usuarios/${this.userId}/entradasRecurrentes/${this.type}/${this.id}`;
    const refToUpdate = ref(this.db, path);
    await update(refToUpdate, this.data);
    this.close();  
  }

  async createMonthly(recurrentId: string | null = null) {
    const path = `usuarios/${this.userId}/resumenMensual/${this.currentMonthYear}/${this.type}`;
    const refToNewItem = push(ref(this.db, path)); // Genera una nueva referencia con un ID único
    await set(refToNewItem, { ...this.data, recurrentId }); // Guarda los datos en la nueva referencia
    
    this.close();    
  }

  async editMonthly() {
    const path = `usuarios/${this.userId}/resumenMensual/${this.currentMonthYear}/${this.type}/${this.id}`;
    const refToUpdate = ref(this.db, path);
    await update(refToUpdate, this.data);

    this.close();  
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  close() {
    //borrar los datos del formulario
    this.data = { categoria: '', monto: 0, dia: 0, descripcion: '' };
    this.router.navigate(['/home']);
  }
}