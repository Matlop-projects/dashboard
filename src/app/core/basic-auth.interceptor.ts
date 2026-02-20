import { HttpInterceptorFn } from '@angular/common/http';

// APIs that should NOT receive X-Country-Id header (to get unfiltered data)
const SKIP_COUNTRY_HEADER_PATTERNS = [
  '/countries',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let authReq = req;

  const token = localStorage.getItem('token');
  const countryId = localStorage.getItem('countryId') || '';
  const language = localStorage.getItem('lang') === 'ar' ? 'ar' : 'en';

  // Check if this request should skip the country header
  const shouldSkipCountryHeader = SKIP_COUNTRY_HEADER_PATTERNS.some(
    pattern => req.url.endsWith(pattern) || req.url.includes(pattern + '?')
  );

  const commonHeaders: Record<string, string> = {
    'Accept-Language': language,
  };

  // Only add X-Country-Id if not in skip list
  if (!shouldSkipCountryHeader) {
    commonHeaders['X-Country-Id'] = countryId;
  }

  if (token && token.trim() !== '') {
    authReq = req.clone({
      setHeaders: {
        ...commonHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    authReq = req.clone({
      setHeaders: commonHeaders,
    });
  }

  return next(authReq);
};
