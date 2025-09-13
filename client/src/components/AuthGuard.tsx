import { useSession, signIn } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type AuthGuardProps = {
  children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    // If the session is finished loading and there's no user, redirect to login
    if (status === 'unauthenticated') {
      signIn('google', { callbackUrl: window.location.pathname });
    }
  }, [status]);

  // While the session is loading, show a spinner
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If the user is authenticated, render the page content
  if (isUser) {
    return <>{children}</>;
  }

  // If redirecting, show a loader
  return (
    <div className="flex items-center justify-center h-screen">
       <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
};

export default AuthGuard;