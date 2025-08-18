import type React from "react"
import type { Metadata } from "next"
import { Roboto_Condensed } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-condensed",
})

export const metadata: Metadata = {
  title: "LinkedIn Contacts Manager",
  description: "Manage your LinkedIn contacts with ease",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    apple: "/linkedin-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={robotoCondensed.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
