import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('JWT Interceptor running on:', req.url);
  const token = localStorage.getItem('auth_token');
  console.log('Token found:', !!token, token ? `${token.substring(0, 20)}...` : 'none');

  if (token && token.split('.').length === 3) {
    console.log('Adding Authorization header');
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  console.log('No valid token found, proceeding without Authorization header');
  return next(req);
};
