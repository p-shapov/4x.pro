import { Wix_Madefor_Text } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

import { PlatformLayout } from "@4x.pro/layouts/platform-layout";

import { PlatformProvider } from "./provider";

const wix = Wix_Madefor_Text({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--wix-madefor-text-font",
});

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <PlatformProvider>
      <PlatformLayout className={wix.className}>{children}</PlatformLayout>
    </PlatformProvider>
  );
};

export default Layout;
