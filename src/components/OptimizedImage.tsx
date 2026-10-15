import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../utils/seo';
import { Car, ImageOff } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string; // Required for strict SEO compliance
  targetWidth?: number;
  quality?: number;
  priority?: boolean;
  aspectRatioClass?: string;
  fallbackTitle?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  targetWidth = 720,
  quality = 70,
  priority = false,
  aspectRatioClass = 'aspect-[16/9]',
  fallbackTitle = 'Automotive Engineering Component',
  className = '',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Shrink the image dimensions and compression quality for ultra-fast opening
  const optimizedSrc = getOptimizedImageUrl(src, targetWidth, quality);

  // Guarantee alt text is never empty for SEO
  const cleanAlt = alt?.trim() || fallbackTitle || 'Automotive vehicle and engineering component';

  if (hasError) {
    return (
      <div
        className={`${aspectRatioClass} w-full bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center text-slate-400 rounded-xl relative overflow-hidden`}
        role="img"
        aria-label={cleanAlt}
      >
        <div className="absolute inset-0 bg-radial from-red-950/20 to-transparent pointer-events-none" />
        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-2.5 text-red-400">
          <Car className="w-6 h-6" />
        </div>
        <p className="text-xs font-semibold text-slate-200 line-clamp-1">{fallbackTitle}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 max-w-xs">{cleanAlt}</p>
        <span className="mt-2 text-[10px] font-mono px-2 py-0.5 bg-slate-800 rounded border border-slate-700/80 text-slate-400">
          High-Fidelity Engineering Visual
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900/60 ${aspectRatioClass} rounded-xl`}>
      {/* Skeleton placeholder while image decodes */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/60 animate-pulse flex items-center justify-center">
          <Car className="w-8 h-8 text-slate-700 animate-pulse" />
        </div>
      )}

      <img
        src={optimizedSrc}
        alt={cleanAlt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } w-full h-full object-cover`}
        {...rest}
      />
    </div>
  );
};
