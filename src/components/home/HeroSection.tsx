import { Copy, Check, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import zcraftLogo from "@/assets/zcraft-logo.png";

export function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText("play.zcraft.net");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          {/* Server Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={zcraftLogo} 
                alt="ZCraft Network" 
                className="h-16 w-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 8px 24px hsl(210 100% 50% / 0.3))' }}
              />
              <div className="absolute -inset-8 bg-primary/15 rounded-3xl blur-2xl animate-pulse-glow -z-10" />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The ultimate Minecraft survival experience. Build, explore, and conquer with thousands of players.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" className="btn-primary-gradient h-14 px-8 text-lg gap-2">
              <Play className="h-5 w-5" />
              Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={copyIP}
              className="h-14 px-8 text-lg gap-2 font-mono"
            >
              {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}
              play.zcraft.net
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "12,458", label: "Players" },
              { value: "1M+", label: "Blocks Placed" },
              { value: "24/7", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}