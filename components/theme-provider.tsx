"use client"
import type { ThemeProviderProps } from "next-themes"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  forcedTheme,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      forcedTheme={forcedTheme}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
