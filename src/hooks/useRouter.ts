import { useState, useEffect, useCallback } from 'react';

export interface RouteState {
  path: string;
  articleSlug: string | null;
  categorySlug: string | null;
  isSavedPage: boolean;
}

export function parsePath(pathname: string, search: string = '', hash: string = ''): RouteState {
  // 1. Check query parameter fallback: ?article=slug
  if (search) {
    const params = new URLSearchParams(search);
    const queryArticle = params.get('article');
    if (queryArticle) {
      return {
        path: `/article/${queryArticle}`,
        articleSlug: queryArticle,
        categorySlug: null,
        isSavedPage: false,
      };
    }
    const queryCat = params.get('category') || params.get('cat');
    if (queryCat) {
      return {
        path: `/category/${queryCat}`,
        articleSlug: null,
        categorySlug: queryCat,
        isSavedPage: false,
      };
    }
  }

  // 2. Check hash fallback: #/article/slug or #/saved
  if (hash) {
    const cleanHash = hash.replace(/^#\/?/, '/');
    const hashArticleMatch = cleanHash.match(/^\/article\/([^/?#]+)/);
    if (hashArticleMatch) {
      return {
        path: `/article/${hashArticleMatch[1]}`,
        articleSlug: hashArticleMatch[1],
        categorySlug: null,
        isSavedPage: false,
      };
    }
    const hashCatMatch = cleanHash.match(/^\/category\/([^/?#]+)/);
    if (hashCatMatch) {
      return {
        path: `/category/${hashCatMatch[1]}`,
        articleSlug: null,
        categorySlug: hashCatMatch[1],
        isSavedPage: false,
      };
    }
    if (cleanHash === '/saved' || cleanHash === 'saved') {
      return {
        path: '/saved',
        articleSlug: null,
        categorySlug: null,
        isSavedPage: true,
      };
    }
  }

  // 3. Primary pathname routing: /article/:slug
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  const articleMatch = cleanPath.match(/^\/article\/([^/?#]+)/);
  if (articleMatch) {
    return {
      path: cleanPath,
      articleSlug: articleMatch[1],
      categorySlug: null,
      isSavedPage: false,
    };
  }

  // /category/:category
  const categoryMatch = cleanPath.match(/^\/category\/([^/?#]+)/);
  if (categoryMatch) {
    return {
      path: cleanPath,
      articleSlug: null,
      categorySlug: categoryMatch[1],
      isSavedPage: false,
    };
  }

  // /saved
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
    const parsed = parsePath(window.location.pathname, window.location.search, window.location.hash);
    return parsed.path;
  });

  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePath(window.location.pathname, window.location.search, window.location.hash);
      setCurrentPath(parsed.path);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
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
