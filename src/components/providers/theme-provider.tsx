"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      // React 19: avoid client script-tag warning; <html class="dark"> covers FOUC
      scriptProps={{ type: "application/json" }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
