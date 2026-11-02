import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { RecoilRoot } from "recoil";
import { HelmetProvider } from "react-helmet-async";
import { ClerkProvider } from "@clerk/clerk-react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "./index.css";

const clerkPublishableKey = import.meta.env.VITE_APP_CLERK_PUBLISHABLE_KEY;

const clerkAppearance = {
  variables: {
    colorPrimary: "#6366f1",
    colorBackground: "#f9fafb",
    colorText: "#111827",
    colorInputBackground: "#ffffff",
    colorInputText: "#111827",
    colorInputBorder: "#d1d5db",
    colorDanger: "#ef4444",
  },
  elements: {
    formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
    card: "shadow-md border border-gray-200",
    headerTitle: "text-xl font-semibold",
  },
};

function MainApp() {
  return (
      <ClerkProvider publishableKey={clerkPublishableKey} appearance={clerkAppearance}>
        <HelmetProvider>
          <RecoilRoot>
            <ThemeProvider>
              <App />
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </RecoilRoot>
        </HelmetProvider>
       </ClerkProvider>
  );
}

const rootContainer = document.getElementById("root");

if (rootContainer) {
  ReactDOM.createRoot(rootContainer).render(<MainApp />);
}
