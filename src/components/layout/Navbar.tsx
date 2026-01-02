import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Play", path: "/play" },
  { name: "Forums", path: "/forums" },
  { name: "News", path: "/news" },
  { name: "Wiki", path: "/wiki" },
  { name: "Rules", path: "/rules" },
  { name: "Support", path: "/support" },
  { name: "Status", path: "/status" },
  { name: "Store", path: "/store", external: true },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const copyIP = () => {
    navigator.clipboard.writeText("play.zcraft.net");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center">
        <p className="text-sm font-medium text-primary">
          🎮 Summer Event is LIVE! Join now for exclusive rewards →
        </p>
      </div>

      <nav className="sticky top-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-xl font-bold text-primary-foreground">Z</span>
              </div>
              <span className="font-display text-xl font-bold text-gradient">ZCraft</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "nav-link flex items-center gap-1",
                    location.pathname === link.path && "active"
                  )}
                >
                  {link.name}
                  {link.external && <ExternalLink className="h-3 w-3" />}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={copyIP}
                className="gap-2 font-mono text-xs"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                play.zcraft.net
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm" className="btn-primary-gradient">
                Register
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-lg transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {link.name}
                  {link.external && <ExternalLink className="h-3 w-3" />}
                </Link>
              ))}
              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1">Login</Button>
                <Button className="flex-1 btn-primary-gradient">Register</Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
