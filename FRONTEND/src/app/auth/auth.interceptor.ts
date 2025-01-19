import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from '../token.service';
import { ApiService } from '../api.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private tokenService: TokenService, private apiService: ApiService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.tokenService.getTokenValue();
        const refreshToken = localStorage.getItem('refreshToken');

        let clonedRequest = req;

        if (accessToken) {

            clonedRequest = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        return next.handle(clonedRequest).pipe(
            catchError((error) => {
                if (error.status === 401 && refreshToken) {
                    return this.apiService.refreshToken(refreshToken).pipe(
                        switchMap((newTokens: any) => {
                            this.tokenService.setToken(newTokens.tokens.accessToken);
                            
                            const retryRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newTokens.tokens.accessToken}`,
                                },
                            });

                            return next.handle(retryRequest);
                        }),
                        catchError((refreshError) => {
                            this.tokenService.clearToken();
                            localStorage.removeItem('refreshToken');
                            return throwError(refreshError);
                        })
                    );
                }
                return throwError(error);
            })
        );
    }
}