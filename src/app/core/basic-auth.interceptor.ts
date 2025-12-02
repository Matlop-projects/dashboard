import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  let authReq = req;

  // Skip adding auth headers for static assets
  const isStaticAsset = req.url.includes('/assets/') || 
                        req.url.includes('.json') || 
                        req.url.includes('.css') || 
                        req.url.includes('.js') ||
                        req.url.includes('.svg') ||
                        req.url.includes('.png') ||
                        req.url.includes('.jpg') ||
                        req.url.includes('.jpeg') ||
                        req.url.includes('.gif') ||
                        req.url.includes('.woff') ||
                        req.url.includes('.woff2') ||
                        req.url.includes('.ttf') ||
                        req.url.includes('.eot');

  if (isStaticAsset) {
    // Don't add auth headers to static assets
    return next(req);
  }

  const token = localStorage.getItem('token');
  
  if (token) {
    // Check token size to prevent 431 errors
    const tokenSize = token.length;
    const maxSafeTokenSize = 8000; // Max safe size in characters
    
    if (tokenSize > maxSafeTokenSize) {
      console.warn('⚠️ Token size is too large:', tokenSize, 'characters');
      console.warn('⚠️ This may cause 431 errors. Consider using a smaller token.');
    }
    
    try {
      authReq = req.clone({
        setHeaders: {
          Authorization: `bearer ${token}`,
          'culture': localStorage.getItem('lang') === 'ar' ? 'ar' : 'en'
        }
      });
    } catch (error) {
      console.error('❌ Error setting headers:', error);
      // If header setting fails, proceed without auth
      console.warn('⚠️ Proceeding without authentication header');
    }
  }

  return next(authReq);
};
