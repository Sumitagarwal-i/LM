
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Zap } from 'lucide-react';

export const CinematicHero: React.FC = () => {
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

    // Animated blob particles
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
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 100 + 50,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        color: i % 2 === 0 ? '#3d9df6' : '#a971f8'
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw blob
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
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
        style={{ filter: 'blur(40px)' }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90 -z-5" />

      {/* Hero Content */}
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl blur opacity-30 animate-pulse" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Paste a link,
              </span>
              <br />
              <span className="text-foreground">
                get publish-ready content
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform any article, video, or blog into professional content formats with AI-powered precision
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
            >
              Start Creating
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-muted-foreground/20 hover:border-purple-500/50 px-8 py-6 text-lg font-semibold backdrop-blur-sm hover:bg-purple-500/10 transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Feature Preview */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "General Mode",
                desc: "Quick analysis and content extraction",
                color: "blue"
              },
              {
                icon: Sparkles,
                title: "Creator Mode",
                desc: "Template-based content generation",
                color: "purple"
              },
              {
                icon: ArrowRight,
                title: "Export Ready",
                desc: "Copy, download, or share instantly",
                color: "green"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className={`w-12 h-12 rounded-lg bg-${feature.color}-500/20 flex items-center justify-center mb-4 mx-auto`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-400`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
