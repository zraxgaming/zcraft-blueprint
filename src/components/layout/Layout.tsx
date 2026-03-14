import { ReactNode, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import Seo, { SeoProps } from "@/components/seo/Seo";
import Breadcrumbs, { Crumb } from "@/components/ui/Breadcrumbs";
import { useSettings } from "@/contexts/SettingsContext";
import { usePerformanceMonitor } from "@/components/ui/OptimizedImage";

interface LayoutProps {
  children: ReactNode;
  seo?: SeoProps;
  breadcrumbs?: Crumb[];
  skipToContent?: string; // ID of main content for skip links
}

export function Layout({ children, seo, breadcrumbs, skipToContent = "main-content" }: LayoutProps) {
  const { settings } = useSettings();

  usePerformanceMonitor('Layout');

  // Skip to main content functionality
  useEffect(() => {
    const handleSkipLink = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && e.target instanceof HTMLAnchorElement && e.target.getAttribute('href') === `#${skipToContent}`) {
        e.preventDefault();
        const mainContent = document.getElementById(skipToContent);
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('keydown', handleSkipLink);
    return () => document.removeEventListener('keydown', handleSkipLink);
  }, [skipToContent]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo {...(seo || {})} />

      {/* Skip to main content link for accessibility */}
      <a
        href={`#${skipToContent}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <Navbar />

      {/* Announcement banner with better accessibility */}
      {settings?.announcementEnabled && settings?.announcementMessage && (
        <div
          className="bg-primary/10 text-primary px-4 py-2 text-center border-b border-primary/20"
          role="banner"
          aria-live="polite"
        >
          <div className="container mx-auto">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
              {settings.announcementMessage}
            </span>
          </div>
        </div>
      )}

      {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}

      <main
        id={skipToContent}
        className="flex-1 focus:outline-none motion-safe:animate-fade-in"
        tabIndex={-1}
        role="main"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
