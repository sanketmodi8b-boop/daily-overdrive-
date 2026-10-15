import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string;
  articleSlug: string | null;
  categorySlug: string | null;
  isSavedPage: boolean;
}

export function parsePath(pathname: string): RouteState {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // Match /article/:slug
  const articleMatch = cleanPath.match(/^\/article\/([^/]+)/);
  if (articleMatch) {
    return {
      path: cleanPath,
      articleSlug: articleMatch[1],
      categorySlug: null,
      isSavedPage: false,
    };
  }

  // Match /category/:category
  const categoryMatch = cleanPath.match(/^\/category\/([^/]+)/);
  if (categoryMatch) {
    return {
      path: cleanPath,
      articleSlug: null,
      categorySlug: categoryMatch[1],
      isSavedPage: false,
    };
  }

  // Match /saved
  if (cleanPath === '/saved') {
    return {
      path: cleanPath,
      articleSlug: null,
      categorySlug: null,
      isSavedPage: true,
    };
  }

  // Default Home
  return {
    path: '/',
    articleSlug: null,
    categorySlug: null,
    isSavedPage: false,
  };
}

export function useRouter() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, replace = false) => {
    if (typeof window === 'undefined') return;
    if (to === window.location.pathname) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const routeState = parsePath(currentPath);

  return {
    currentPath,
    routeState,
    navigate,
  };
}
