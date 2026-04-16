import { useAuth } from '@/hooks/useAuth';
import { useLocation, Redirect } from 'wouter';
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isSignInPending, isSignUpPending } = useAuth();
  const [, navigate] = useLocation(); // ← wouter's navigate equivalent
  const [location] = useLocation();

  if (isSignInPending || isSignUpPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute: isLoggedIn =', isLoggedIn);
  if (!isLoggedIn) {
    return <Redirect to={`/login?from=${encodeURIComponent(location)}`} />;
  }

  return <>{children}</>;
}