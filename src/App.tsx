import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PlayPage from "./pages/PlayPage";
import ForumsPage from "./pages/ForumsPage";
import NewsPage from "./pages/NewsPage";
import WikiPage from "./pages/WikiPage";
import RulesPage from "./pages/RulesPage";
import SupportPage from "./pages/SupportPage";
import StatusPage from "./pages/StatusPage";
import StorePage from "./pages/StorePage";
import StaffPage from "./pages/StaffPage";
import EventsPage from "./pages/EventsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/play" element={<PlayPage />} />
          <Route path="/forums" element={<ForumsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/events" element={<EventsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
