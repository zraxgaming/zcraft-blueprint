import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const footerLinks = {
  Server: [
    { name: "Home", path: "/" },
    { name: "Play", path: "/play" },
    { name: "Status", path: "/status" },
    { name: "Rules", path: "/rules" },
  ],
  Community: [
    { name: "Forums", path: "/forums" },
    { name: "News", path: "/news" },
    { name: "Events", path: "/events" },
    { name: "Staff", path: "/staff" },
  ],
  Resources: [
    { name: "Wiki", path: "/wiki" },
    { name: "Support", path: "/support" },
    { name: "Store", path: "/store", external: true },
  ],
  Legal: [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
  ],
};

const socialLinks = [
  { name: "Discord", icon: "💬", url: "#" },
  { name: "Twitter", icon: "🐦", url: "#" },
  { name: "YouTube", icon: "📺", url: "#" },
];

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="font-display text-xl font-bold text-primary-foreground">Z</span>
              </div>
              <span className="font-display text-xl font-bold text-gradient">ZCraft</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The ultimate Minecraft experience. Join thousands of players today!
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold mb-4 text-foreground">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {link.name}
                      {link.external && <ExternalLink className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 ZCraft. Not affiliated with Mojang AB.
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            play.zcraft.net
          </p>
        </div>
      </div>
    </footer>
  );
}
