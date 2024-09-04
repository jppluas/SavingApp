import { Component } from '@angular/core';
import {  AlertController } from '@ionic/angular';
import { IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonTitle, IonInput, IonLabel, IonItem} from '@ionic/angular/standalone';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, IonContent, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonTitle, IonInput, IonLabel, IonItem],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private auth: Auth, private router: Router, private alertCtrl: AlertController) {}

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      console.log('Login exitoso');
      this.router.navigate(['/tabs/tab1']); // Redirige al usuario autenticado
    } catch (error) {
      const errorMessage = (error as FirebaseError).message; // Conversión explícita
      console.error('Error en el login', errorMessage);
      this.showErrorAlert(this.translateErrorMessage(errorMessage));
    }
  }

  goToRegister() {
    this.router.navigate(['/register']); // Redirige al usuario a la pantalla de registro
  }

  translateErrorMessage(message: string): string {
    switch (true) {
      case message.includes('auth/invalid-email'):
        return 'Correo electrónico inválido. Por favor, verifica el formato.';
      case message.includes('auth/user-disabled'):
        return 'Esta cuenta ha sido deshabilitada. Contacta al soporte para más información.';
      case message.includes('auth/user-not-found'):
        return 'No se ha encontrado un usuario con ese correo electrónico.';
      case message.includes('auth/wrong-password'):
        return 'Usuario y/o contraseña inválidos. Por favor, verifica tus datos.';
      case message.includes('auth/too-many-requests'):
        return 'Demasiados intentos fallidos. Inténtalo más tarde.';
        case message.includes('auth/invalid-credential'):
          return 'Usuario y/o contraseña inválidos. Por favor, verifica tus datos.';
      default:
        return 'Ocurrió un error. Por favor, inténtalo de nuevo.';
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
