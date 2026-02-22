import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import Seo, { SeoProps } from "@/components/seo/Seo";
import Breadcrumbs, { Crumb } from "@/components/ui/Breadcrumbs";
import { useSettings } from "@/contexts/SettingsContext";

interface LayoutProps {
  children: ReactNode;
  seo?: SeoProps;
  breadcrumbs?: Crumb[];
}

export function Layout({ children, seo, breadcrumbs }: LayoutProps) {
  const { settings } = useSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Seo {...(seo || {})} breadcrumbs={breadcrumbs} />
      <Navbar />
      {settings?.announcementEnabled && settings?.announcementMessage && (
        <div className="bg-primary/10 text-primary px-4 py-2 text-center">
          <div className="container mx-auto">{settings.announcementMessage}</div>
        </div>
      )}
      {breadcrumbs && <Breadcrumbs crumbs={breadcrumbs} />}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
