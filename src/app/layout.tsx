import "./globals.css";
import React from "react";
import NavBar from "@/app/components/Navbar";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" data-theme={'light'}>
        <body>
        <NavBar/>
        {children}
        </body>
        </html>
    );
}
