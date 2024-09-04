import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Auth, signOut } from '@angular/fire/auth';
import { User } from '@firebase/auth';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Database, ref, onValue, update } from '@angular/fire/database';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow  } from '@ionic/angular/standalone';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonIcon, IonLabel, IonItem, IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCol, IonRow, FormsModule],
})
export class UserProfileComponent {
  user: User | null = null;
  nombre: string = '';
  email: string = '';

  constructor(private auth: Auth, private router: Router, private alertCtrl: AlertController, private db: Database) {}

  ionViewWillEnter() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.user = this.auth.currentUser;
    if (this.user) {
      onValue(ref(this.db, `usuarios/${this.user.uid}/nombre`), (snapshot) => {
        this.nombre = snapshot.val(); // Asigna el valor del snapshot a nombreUsuario
      });
      this.email = this.user.email || '';
    }
  }

  async updateProfile() {
    if (!this.user) return;

    try {
      const path = `usuarios/${this.user.uid}`;
      const refToUpdate = ref(this.db, path);
      await update(refToUpdate, { nombre: this.nombre });

      const alert = await this.alertCtrl.create({
        header: 'Éxito',
        message: 'Perfil actualizado correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      console.error('Error actualizando el perfil:', error);
      this.showErrorAlert((error as Error).message);
    }
  }
  

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']); // Redirige al usuario al login después de cerrar sesión
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      this.showErrorAlert((error as Error).message);
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