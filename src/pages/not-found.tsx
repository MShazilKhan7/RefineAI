import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, LogIn } from "lucide-react";

export default function NotFound() {
  const [location, setLocation] = useLocation();

  // Auto-redirect to login after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-destructive">
        <CardContent className="pt-10 text-center">
          <div className="flex flex-col items-center gap-5">
            {/* Animated Icon Container */}
            <div className="p-4 bg-red-50 rounded-full animate-pulse">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                404
              </h1>
              <p className="text-xl font-semibold text-slate-700">
                Lost in space?
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The page you're looking for doesn't exist. <br />
                We'll take you back to the <strong>Login</strong> page in a few seconds.
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pb-10 px-8">
          {/* Declarative link using wouter's Link component */}
          <Link href="/login">
            <Button className="w-full gap-2 font-bold" size="lg">
              <LogIn size={18} />
              Login Now
            </Button>
          </Link>
          
          <Button 
            variant="link" 
            onClick={() => window.history.back()} 
            className="text-muted-foreground hover:text-primary transition-all"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go back to where I was
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}