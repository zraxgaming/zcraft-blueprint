import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  'aria-label'?: string;
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  text,
  'aria-label': ariaLabel = 'Loading...'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2
        className={cn('animate-spin text-primary', sizeClasses[size])}
        aria-hidden="true"
      />
      {text && (
        <span className="text-sm text-muted-foreground animate-pulse">
          {text}
        </span>
      )}
      <span className="sr-only" role="status" aria-live="polite">
        {ariaLabel}
      </span>
    </div>
  );
}

interface LoadingPageProps {
  title?: string;
  description?: string;
  className?: string;
}

export function LoadingPage({
  title = 'Loading...',
  description,
  className = ''
}: LoadingPageProps) {
  return (
    <div className={cn('flex items-center justify-center min-h-screen bg-background', className)}>
      <div className="text-center space-y-4 max-w-md mx-auto px-4">
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-primary animate-spin" aria-hidden="true" />
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-foreground animate-pulse">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground animate-pulse">
              {description}
            </p>
          )}
        </div>

        {/* Screen reader status */}
        <div className="sr-only" role="status" aria-live="polite">
          {title}. {description}
        </div>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  className?: string;
}

export function LoadingCard({ title, className = '' }: LoadingCardProps) {
  return (
    <div className={cn('bg-card border rounded-lg p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
        <div className="h-3 bg-muted rounded w-4/6 animate-pulse" />
      </div>

      {title && (
        <div className="sr-only" role="status" aria-live="polite">
          Loading {title}...
        </div>
      )}
    </div>
  );
}

// Skeleton loading for different content types
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-3 bg-muted rounded animate-pulse',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  return (
    <div
      className={cn('rounded-full bg-muted animate-pulse', sizeClasses[size], className)}
      aria-hidden="true"
    />
  );
}