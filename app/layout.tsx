import "@/styles/global.scss";
import type { Viewport } from "next";
import BoxStateProvider from "./components/verhaal_speciaal/contexts/boxStateContext";
import RecordedTextProvider from "./components/verhaal_speciaal/contexts/recordedTextContext";
import BoxProvider from "./components/verhaal_speciaal/contexts/boxContext";
import StoryContextProvider from "./components/verhaal_speciaal/contexts/storyContext";
import LoaderProvider from "./components/verhaal_speciaal/contexts/loaderContext";
import { Suspense } from "react";

// Useful when we use swiper v@10x
// import { register } from "swiper/element/bundle";
// register();

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LoaderProvider>
          <StoryContextProvider>
            <BoxStateProvider>
              <RecordedTextProvider>
                <BoxProvider>
                  <Suspense>{children}</Suspense>
                </BoxProvider>
              </RecordedTextProvider>
            </BoxStateProvider>
          </StoryContextProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
