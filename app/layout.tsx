import {colorModeManager, ColorModeScript, UIProvider} from "@yamada-ui/react";
import Header from "@/components/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "kokon",
  description: "An app to help you find help for anything",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <ColorModeScript type="cookie" nonce="testing" />
      <UIProvider colorModeManager={{ ...colorModeManager }.cookieStorage}>
        <Header/>
        <main>
            {children}
        </main>
      </UIProvider>
      </body>
    </html>
  );
}
