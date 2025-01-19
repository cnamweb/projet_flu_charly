import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Retrieve the token from the token service signal
        const token = this.tokenService.getTokenValue();
        console.log('Token:', token);

        // Clone the request and add the Authorization header
        const clonedRequest = token
            ? req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            })
            : req;

        // Pass the cloned request to the next handler
        return next.handle(clonedRequest);
    }
}