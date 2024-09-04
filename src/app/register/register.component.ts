import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, set } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow  } from '@ionic/angular/standalone';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow, FormsModule],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName: string = '';

  constructor(
    private auth: Auth,
    private db: Database,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      this.showErrorAlert('Las contraseñas no coinciden.');
      return;
    }

    if (this.fullName.trim() === '') {
      this.showErrorAlert('El nombre completo es obligatorio.');
      return;
    }

    try {
      // Crear la cuenta en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const user = userCredential.user;

      // Obtener el mes y año actual para usar como ID en el resumen mensual
      const currentDate = new Date();
      const monthYear = `${currentDate.getFullYear()}-${(
        '0' +
        (currentDate.getMonth() + 1)
      ).slice(-2)}`;

      // Crear la estructura básica en Realtime Database con datos por defecto
      const userRef = ref(this.db, `usuarios/${user.uid}`);
      await set(userRef, {
        nombre: this.fullName,
        correo: this.email,
        resumenMensual: {
          '2024-08': {
            gastos: {
              gasto1: {
                categoria: 'Entretenimiento',
                descripcion: 'Gasto de entretenimiento de prueba',
                dia: 15,
                monto: 100,
              },
            },
          },
        },
      });

      console.log('Registro exitoso y estructura creada en la base de datos');
      this.router.navigate(['/tabs/tab1']); // Redirige al usuario después de registrarse
    } catch (error) {
      console.error('Error en el registro', error);
      this.showErrorAlert(
        this.translateErrorMessage((error as FirebaseError).message)
      );
    }
  }

  goToLogin() {
    this.router.navigate(['/login']); // Redirige al usuario a la pantalla de login
  }

  translateErrorMessage(message: string): string {
    switch (true) {
      case message.includes('auth/email-already-in-use'):
        return 'Este correo electrónico ya está en uso. Por favor, usa otro o inicia sesión.';
      case message.includes('auth/invalid-email'):
        return 'El formato del correo electrónico no es válido. Por favor, verifica e inténtalo de nuevo.';
      case message.includes('auth/weak-password'):
        return 'La contraseña es demasiado débil. Por favor, elige una más segura.';
      case message.includes('auth/operation-not-allowed'):
        return 'El registro de nuevas cuentas está deshabilitado temporalmente. Por favor, inténtalo más tarde.';
      default:
        return 'Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.';
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
