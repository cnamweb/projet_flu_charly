import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './models/produit';
import { environment } from '../environments/environment';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }
  public getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(environment.backendProduct);
  }

  public getProduitsFiltre( name : string, category : string): Observable<Produit[]> {
    const body = { name, category};
    return this.http.post<Produit[]>(environment.backendProduct, body);
  }

  public getProduitCategories(): Observable<any> {
    return this.http.get<any>(environment.backendProductCategories);
  }

  public register(email: string, pseudo: string, password: string): Observable<any> {
    const body = { email, pseudo, password };
    return this.http.post(environment.backendRegister, body);
  }

  public login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(environment.backendLogin, body);
  }

  public getCurrentUser(): Observable<any> {
    return this.http.get<any>(environment.backendUser); 
  }

  public updateUser(updatedUser: any): Observable<any> {
    return this.http.put<any>(environment.backendUser, updatedUser);
  }

  public refreshToken(refreshToken : string): Observable<any> {
    const body = { refreshToken };
    return this.http.post(environment.backendRefreshToken, body);
  }
}