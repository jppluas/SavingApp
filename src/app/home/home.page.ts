import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, onValue } from '@angular/fire/database';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { CardSaldoComponent } from '../card-saldo/card-saldo.component';
import { FinanceModalComponent } from '../finances/finance-modal.component';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput,
  IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent,
  IonCardTitle, IonCol, IonRow, IonModal
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';


interface Transaccion {
  tipo: string;
  monto: number;
  dia: number;
  descripcion: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ExploreContainerComponent,
    CardSaldoComponent,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput,
    IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent,
    IonCardTitle, IonCol, IonRow, IonModal  // Asegúrate de incluir IonModal aquí
  ],
  providers: [ModalController],
})
export class HomePage {
  tituloIngreso: string = "Saldo actual";
  dineroRestante: number = 0;
  ingresosTotales: number = 0;
  gastosTotales: number = 0;
  diasRestantes: number = 15;
  nombreUsuario: string = '';
  transacciones: Transaccion[] = [];
  userId: string | null = null;


/*   defaultUser = {
    email: '123@gmail.com',
    password: '123456',
  }; */

  constructor(
    private auth: Auth,
    private db: Database,
    private modalCtrl: ModalController,
    private router: Router
  ) {}

  /* ngOnInit() {
    this.autoLogin();
  }

  async autoLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        this.defaultUser.email,
        this.defaultUser.password
      );

      this.userId = userCredential.user.uid;
      this.loadFinances(this.userId);
    } catch (error) {
      console.error('Error en el inicio de sesión automático:', error);
    }
  } */

  ionViewWillEnter() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.userId = user.uid;
        onValue(ref(this.db, `usuarios/${user.uid}/nombre`), (snapshot) => {
          this.nombreUsuario = snapshot.val();
        });
      }
    });

    if (this.auth.currentUser) {
      this.loadFinances(this.auth.currentUser.uid);
    }
  }

  loadFinances(userId: string) {
    this.ingresosTotales = 0;
    this.gastosTotales = 0;
    this.transacciones = [];

    const currentDate = new Date();
    const currentMonthYear = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;

    const resumenMensualRef = ref(this.db, `usuarios/${userId}/resumenMensual/${currentMonthYear}`);
    const resumenRecurrentesRef = ref(this.db, `usuarios/${userId}/entradasRecurrentes`);

    onValue(resumenMensualRef, (snapshot) => {
      const data = snapshot.val() || { ingresos: {}, gastos: {} };

      const ingresosMensuales = data.ingresos ? Object.values(data.ingresos as Record<string, { monto: number, dia: number, descripcion: string }>) : [];
      const gastosMensuales = data.gastos ? Object.values(data.gastos as Record<string, { monto: number, dia: number, descripcion: string }>) : [];

      this.ingresosTotales += ingresosMensuales.reduce((acc, curr) => acc + curr.monto, 0);
      this.gastosTotales += gastosMensuales.reduce((acc, curr) => acc + curr.monto, 0);

      this.transacciones = [...this.transacciones,
        ...ingresosMensuales.map((ingreso) => ({ tipo: 'Ingreso', monto: ingreso.monto, dia: ingreso.dia, descripcion: ingreso.descripcion })),
        ...gastosMensuales.map((gasto) => ({ tipo: 'Gasto', monto: gasto.monto, dia: gasto.dia, descripcion: gasto.descripcion })),
      ];
    });

    onValue(resumenRecurrentesRef, (snapshot) => {
      const data = snapshot.val() || { ingresos: {}, gastos: {} };

      const ingresosRecurrentes = data.ingresos ? Object.values(data.ingresos as Record<string, { monto: number, dia: number, descripcion: string }>) : [];
      const gastosRecurrentes = data.gastos ? Object.values(data.gastos as Record<string, { monto: number, dia: number, descripcion: string }>) : [];

      this.ingresosTotales += ingresosRecurrentes.reduce((acc, curr) => acc + curr.monto, 0);
      this.gastosTotales += gastosRecurrentes.reduce((acc, curr) => acc + curr.monto, 0);

      this.transacciones = [...this.transacciones,
        ...ingresosRecurrentes.map((ingreso) => ({ tipo: 'Ingreso', monto: ingreso.monto, dia: ingreso.dia, descripcion: ingreso.descripcion })),
        ...gastosRecurrentes.map((gasto) => ({ tipo: 'Gasto', monto: gasto.monto, dia: gasto.dia, descripcion: gasto.descripcion })),
      ];

      this.dineroRestante = this.ingresosTotales - this.gastosTotales;
      this.transacciones = this.transacciones.sort((a, b) => b.dia - a.dia);
    });
  }

  async openModal(type: string, period: boolean | null = null, item: any = null, id: string | null = null, monthYear: string | null = null) {
    this.router.navigate(['/financeModal'], {
      queryParams: {
        userId: this.userId,
        currentMonthYear: monthYear || this.getCurrentMonthYear(),
        type,
        period: period ? 'true' : 'false',
        item: item ? JSON.stringify(item) : null,
        id,
      },
    });
  }

  getCurrentMonthYear(): string {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;
  }
}
