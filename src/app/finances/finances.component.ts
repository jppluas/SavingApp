import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Auth } from '@angular/fire/auth';
import { Database, ref, onValue, remove } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FinanceModalComponent } from './finance-modal.component';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow  } from '@ionic/angular/standalone';


@Component({
  selector: 'app-finances',
  templateUrl: './finances.component.html',
  styleUrls: ['./finances.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow, FormsModule, CommonModule],
  providers: [ModalController],
})
export class FinancesComponent implements OnInit {
  userId: string | null = null;
  currentMonthYear: string = '';
  recurringIncomes: { [key: string]: any } = {}; 
  recurringExpenses: { [key: string]: any } = {};
  monthlyValues: { [key: string]: any } = {};

  constructor(
    private auth: Auth,
    private db: Database,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const currentdate = new Date();
    this.currentMonthYear = `${currentdate.getFullYear()}-${('0' + (currentdate.getMonth() + 1)).slice(-2)}`;

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        this.loadData();
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  loadData() {
    // Load recurring incomes
    const recurringIncomesRef = ref(this.db, `usuarios/${this.userId}/entradasRecurrentes/ingresos`);
    onValue(recurringIncomesRef, (snapshot) => {
      this.recurringIncomes = snapshot.val() || {};
    });

    // Load recurring expenses
    const recurringExpensesRef = ref(this.db, `usuarios/${this.userId}/entradasRecurrentes/gastos`);
    onValue(recurringExpensesRef, (snapshot) => {
      this.recurringExpenses = snapshot.val() || {};
    });

    // Load all months' incomes and expenses
    const monthlyValuesRef = ref(this.db, `usuarios/${this.userId}/resumenMensual/`);
    onValue(monthlyValuesRef, (snapshot) => {
      this.monthlyValues = snapshot.val() || {};
    });
  }

  async openModal(type: string, period: boolean | null = null, item: any = null, id: string | null = null, monthYear: string | null = null) {
    this.router.navigate(['/financeModal'], {
      queryParams: {
        userId: this.userId,
        currentMonthYear: monthYear || this.currentMonthYear,
        type,
        period: period ? 'true' : 'false',
        item: item ? JSON.stringify(item) : null,
        id,
      },
    });
  }

  async confirmDelete(type: string, id: string, monthYear: string | null = null, isRecurring: boolean = false) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => this.deleteItem(type, id, monthYear, isRecurring),
        },
      ],
    });

    await alert.present();
  }

  async deleteItem(type: string, id: string, monthYear: string | null = null, isRecurring: boolean = false) {
    let basePath;
    if (isRecurring) {
      basePath = `usuarios/${this.userId}/entradasRecurrentes/${type}`;
    } else {
      basePath = `usuarios/${this.userId}/resumenMensual/${monthYear}/${type}`;
    }
    const itemRef = ref(this.db, `${basePath}/${id}`);
    await remove(itemRef);
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj).sort((a, b) => Number(b) - Number(a)) : [];
  }

  getMonthKeys(obj: any): string[] {
    return obj ? Object.keys(obj).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return new Date(yearB, monthB - 1).getTime() - new Date(yearA, monthA - 1).getTime();
    }) : [];
  }

  formatMonthYear(monthYear: string): string {
    const [year, month] = monthYear.split('-');
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  }
}
