import { Wix_Madefor_Text } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

import { PlatformLayout } from "@4x.pro/layouts/platform-layout";

const wix = Wix_Madefor_Text({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--wix-madefor-text-font",
});

const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return <PlatformLayout className={wix.className}>{children}</PlatformLayout>;
};

export default AppLayout;
