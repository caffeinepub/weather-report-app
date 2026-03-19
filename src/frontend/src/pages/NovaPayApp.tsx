import { Skeleton } from "@/components/ui/skeleton";
import Dashboard from "../components/novapay/Dashboard";
import LoginScreen from "../components/novapay/LoginScreen";
import ProfileSetup from "../components/novapay/ProfileSetup";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

export default function NovaPayApp() {
  const { identity, isInitializing, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (isInitializing || loginStatus === "initializing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!profile || !profile.name) {
    return <ProfileSetup />;
  }

  return <Dashboard userName={profile.name} />;
}
