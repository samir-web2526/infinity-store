"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import useSettings from "@/hooks/useSettings";

function DynamicFaviconUpdater() {
  useSettings();
  return null;
}

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <DynamicFaviconUpdater />
              {children}
            </QueryClientProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
