import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  // Login con correo y contraseña
  async login(email: string, password: string) {
    try {
      return await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error en el login:", error);
      throw error;
    }
  }

  // Registro de nuevo usuario
  async register(email: string, password: string) {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      return await this.afAuth.signOut();
    } catch (error) {
      console.error("Error en el logout:", error);
      throw error;
    }
  }

  // Obtener el estado de autenticación del usuario
  getAuthState() {
    return this.afAuth.authState;
  }
}
