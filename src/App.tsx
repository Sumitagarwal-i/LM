import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { Analytics } from '@vercel/analytics/react';

const queryClient = new QueryClient();

// Add proxy routes for Supabase Edge Functions
const handleApiRequest = async (functionName: string, body: any) => {
  const supabaseUrl = "https://xeemoihvdxkvjqzvxyep.supabase.co";
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZW1vaWh2ZHhrdmpxenZ4eWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNzg5OTgsImV4cCI6MjA2NTc1NDk5OH0.4Ja5sTDiuy-0OjJKIdYs3RuC2dT6L5z4obybBevze_M";
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supabase function ${functionName} error:`, response.status, errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`Error calling Supabase function ${functionName}:`, error);
    throw error;
  }
};

// Set up API routes
const setupApiRoutes = () => {
  // Intercept fetch requests to /api/* and redirect to Supabase Edge Functions
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    if (url.startsWith('/api/analyze-link')) {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const newBody = {
        link: body.url || body.link,
        actionSet: body.actionSet || 0
      };
      return new Response(JSON.stringify(await handleApiRequest('analyze-link', newBody)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (url.startsWith('/api/execute-action')) {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const newBody = {
        link: body.url || body.link,
        action: body.action || body.actionTitle || body.title
      };
      return new Response(JSON.stringify(await handleApiRequest('execute-action', newBody)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.startsWith('/api/scrape-content')) {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      return new Response(JSON.stringify(await handleApiRequest('scrape-content', body)), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.startsWith('/api/generate-actions')) {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.startsWith('/api/perform-action')) {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      const newBody = {
        link: body.url,
        action: body.action?.title || body.actionTitle
      };
      const result = await handleApiRequest('execute-action', newBody);
      return new Response(JSON.stringify({ result: result.content }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return originalFetch(input, init);
  };
};

setupApiRoutes();

const App = () => {
  return (
    <div
      style={{ height: '100vh', overflowY: 'auto', background: '#000', WebkitOverflowScrolling: 'touch' }}
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background text-foreground">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </BrowserRouter>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Analytics/>
    </div>
  );
};

export default App;
