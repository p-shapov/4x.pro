import { Wix_Madefor_Text } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

import { PerpetualsLayout } from "@4x.pro/layouts/perpetuals-layout";

import { PerpetualsPageProvider } from "./provider";

const wix = Wix_Madefor_Text({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--wix-madefor-text-font",
});

const PerpetualsPageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <body className={wix.className}>
      <PerpetualsPageProvider>
        <PerpetualsLayout>{children}</PerpetualsLayout>
      </PerpetualsPageProvider>
    </body>
  );
};

export default PerpetualsPageLayout;
