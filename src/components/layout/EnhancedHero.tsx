
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Download } from 'lucide-react';

interface EnhancedHeroProps {
  onModeSelect: (mode: 'general' | 'creator') => void;
}

export const EnhancedHero: React.FC<EnhancedHeroProps> = ({ onModeSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '#3b82f6' : '#8b5cf6'
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 -z-10"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95 -z-5" />

      {/* Hero Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="space-y-12 max-w-5xl mx-auto">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
              Paste a link,
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                get publish-ready
              </span>
              <br />
              content
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform any article, video, or blog into professional content formats with AI-powered precision. 
              Built for creators, marketers, and content curators.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              onClick={() => onModeSelect('general')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40 border-0"
            >
              <Zap className="mr-3 h-6 w-6" />
              General Mode
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg"
              onClick={() => onModeSelect('creator')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl shadow-purple-500/25 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40 border-0"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Creator Mode
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>

            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-muted-foreground/30 hover:border-primary/50 px-10 py-6 text-lg font-semibold backdrop-blur-sm hover:bg-primary/10 transition-all duration-300"
            >
              <Download className="mr-3 h-5 w-5" />
              Export Formats
            </Button>
          </div>

          {/* Feature Preview Grid */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Instant Analysis",
                desc: "Extract key insights and summaries from any link in seconds",
                gradient: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: Sparkles,
                title: "Template Magic",
                desc: "Transform content into LinkedIn posts, threads, newsletters, and more",
                gradient: "from-purple-500/20 to-pink-500/20"
              },
              {
                icon: Download,
                title: "Export Ready",
                desc: "Copy, download as PDF, or share with one click",
                gradient: "from-green-500/20 to-emerald-500/20"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className={`group p-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
