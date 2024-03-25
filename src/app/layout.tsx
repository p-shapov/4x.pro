import "@public/css/tailwind.css";
import "@public/css/color-scheme.css";

import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";

import { RootProvider } from "./provider";

const metadata: Metadata = {
  title: "4x.pro",
};

const RootLayout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" className="dark">
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
