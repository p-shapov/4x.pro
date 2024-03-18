import "./global.css";

import cn from "classnames";
import type { Metadata } from "next";
import { Wix_Madefor_Text, Inter } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

import { RootProvider } from "./provider";

const metadata: Metadata = {
  title: "4x.pro",
};

const inter = Inter({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--inter",
});
const wix = Wix_Madefor_Text({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--wix-madefor-text-font",
});

const RootLayout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className={cn(inter.className, wix.className)}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
};

export { metadata };
export default RootLayout;
