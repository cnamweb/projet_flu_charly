import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    readonly accessToken = signal<string | null>(null);

    constructor() {}

    setToken(token: string): void {
        this.accessToken.set(token);
    }
    
    clearToken(): void {
        this.accessToken.set(null);
    }

    get token() {
        return this.accessToken;
    }
    
    getTokenValue(): string | null {
        return this.accessToken();
    }
}