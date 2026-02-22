import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PlayPage from "./pages/PlayPage";
import ForumsPage from "./pages/ForumsPage";
import ForumThreadPage from "./pages/ForumThreadPage";
import NewsPage from "./pages/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import RulesPage from "./pages/RulesPage";
import SupportPage from "./pages/SupportPage";
import StatusPage from "./pages/StatusPage";
import StorePage from "./pages/StorePage";
import StaffPage from "./pages/StaffPage";
import EventsPage from "./pages/EventsPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ServerListings from "./pages/ServerListings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import AdminPage from "./pages/AdminPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminNewsPage from "./pages/admin/AdminNewsPage";
import AdminForumsPage from "./pages/admin/AdminForumsPage";
import AdminWikiPage from "./pages/admin/AdminWikiPage";
import AdminChangelogsPage from "./pages/admin/AdminChangelogsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import MaintenancePage from "./pages/MaintenancePage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DiscordRedirectPage from "./pages/DiscordRedirectPage";
import NotFound from "./pages/NotFound";
import ChangelogsPage from "./pages/ChangelogsPage";
import ChangelogDetailPage from "./pages/ChangelogDetailPage";

const queryClient = new QueryClient();

function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSettings();
  const { loading: authLoading, isAdmin } = useAuth();
  const location = useLocation();
  // while loading settings, show children (or we could show spinner)
  if (loading || !settings) return <>{children}</>;

  // If maintenance mode is enabled, redirect non-admins to /maintenance
  // Auth is available via useAuth inside pages; here we simply redirect all users
  if (settings.maintenanceMode && location.pathname !== '/maintenance') {
    // allow admins to bypass maintenance
    if (authLoading) return <>{children}</>;
    if (!isAdmin) return <Navigate to="/maintenance" replace />;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MaintenanceGate>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/play" element={<PlayPage />} />
                <Route path="/server-listings" element={<ServerListings />} />
                <Route path="/forums" element={<ForumsPage />} />
                <Route path="/forums/:slug" element={<ForumThreadPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsArticlePage />} />
                <Route path="/changelogs" element={<ChangelogsPage />} />
                <Route path="/changelogs/:version" element={<ChangelogDetailPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/store" element={<StorePage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/discord" element={<DiscordRedirectPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/news" element={<AdminNewsPage />} />
                <Route path="/admin/forums" element={<AdminForumsPage />} />
                <Route path="/admin/wiki" element={<AdminWikiPage />} />
                <Route path="/admin/changelogs" element={<AdminChangelogsPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/auth/callback" element={<AuthCallbackPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MaintenanceGate>
          </BrowserRouter>
        </TooltipProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
