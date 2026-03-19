import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import NovaPayApp from "./pages/NovaPayApp";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <NovaPayApp />
          <Toaster />
        </QueryClientProvider>
      </InternetIdentityProvider>
    </ThemeProvider>
  );
}
