import cn from "classnames";
import { Unbounded } from "next/font/google";
import type { FC, PropsWithChildren } from "react";

const unbounded = Unbounded({
  weight: ["200"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  variable: "--unbounded-text-font",
});

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <body className={unbounded.className}>
      <main className={cn("bg-[url('/images/graph.png')]", "bg-cover")}>
        {children}
      </main>
    </body>
  );
};

export default Layout;
