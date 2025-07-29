import { HttpInterceptorFn } from '@angular/common/http';
import { ENVIRONMENT } from '../../environments/environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const apiUrl = ENVIRONMENT.apiUrl;

  if (req.url.startsWith(`${apiUrl}`)) {
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    return next(modifiedReq);
  }

  return next(req);
};
