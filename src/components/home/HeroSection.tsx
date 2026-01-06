import { Copy, Check, Play, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import zcraftLogo from "@/assets/zcraft-logo.png";
import { supabase } from "@/integrations/supabase/client";

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    players: "...",
    blocks: "...",
    uptime: "99.9%"
  });

  useEffect(() => {
    // Fetch real stats from admin_settings
    const fetchStats = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('key, value')
        .in('key', ['total_players', 'total_blocks', 'server_uptime']);
      
      if (data) {
        const statsMap: Record<string, string> = {};
        data.forEach(item => {
          statsMap[item.key] = item.value;
        });
        setStats({
          players: statsMap['total_players'] || '12,458',
          blocks: statsMap['total_blocks'] || '1M+',
          uptime: statsMap['server_uptime'] || '99.9%'
        });
      }
    };
    fetchStats();
  }, []);

  const copyIP = () => {
    navigator.clipboard.writeText("play.zcraft.net");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden py-28 lg:py-40">
      {/* Animated background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Decorative blobs */}
      <motion.div 
        className="absolute top-10 left-5 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-5 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 relative">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Server Logo - BIGGER */}
          <motion.div 
            className="mb-10 flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative group">
              <motion.img 
                src={zcraftLogo} 
                alt="ZCraft Network" 
                className="h-32 md:h-40 lg:h-48 w-auto object-contain"
                style={{ filter: 'drop-shadow(0 12px 40px hsl(var(--primary) / 0.4))' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              {/* Glow effect */}
              <motion.div 
                className="absolute -inset-12 bg-primary/20 rounded-full blur-3xl -z-10"
                animate={{ 
                  opacity: [0.4, 0.7, 0.4],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Sparkle accents */}
              <motion.div
                className="absolute -top-4 -right-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-6 w-6 text-primary/60" />
              </motion.div>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The ultimate Minecraft survival experience. Build, explore, and conquer with thousands of players.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" className="btn-primary-gradient h-16 px-10 text-lg gap-3 shadow-xl shadow-primary/25">
                <Play className="h-6 w-6" />
                Play Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={copyIP}
                className="h-16 px-10 text-lg gap-3 font-mono border-2 hover:bg-primary/10"
              >
                {copied ? <Check className="h-6 w-6 text-emerald-500" /> : <Copy className="h-6 w-6" />}
                play.zcraft.net
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {[
              { value: stats.players, label: "Players" },
              { value: stats.blocks, label: "Blocks Placed" },
              { value: stats.uptime, label: "Uptime" },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50"
                whileHover={{ scale: 1.05, backgroundColor: "hsl(var(--card))" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
              >
                <p className="font-display text-2xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
