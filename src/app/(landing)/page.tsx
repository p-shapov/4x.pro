"use client";
import cn from "classnames";
import Image from "next/image";
import type { FC } from "react";

import { ButtonLink } from "@4x.pro/ui-kit/button-link";

const RootPage: FC = () => {
  return (
    <div
      className={cn(
        "grid",
        "grid-rows-[max-content_1fr]",
        "max-w-[1200px]",
        "w-full",
        "mx-auto",
        "pt-[60px]",
        "h-[100vh]",
        "overflow-hidden",
      )}
    >
      <div className={cn("flex", "justify-between", "mb-[70px]")}>
        <Image src="/images/logo.svg" alt="4X logo" width={798} height={66} />
        <span
          className={cn(
            "text-[2.4rem]",
            "leading-[1.5]",
            "font-[family-name:var(--unbounded-text-font)]",
            "text-[2.4rem]",
            "font-[200]",
            "leading-[1.6]",
            "text-white",
            "whitespace-pre-wrap",
          )}
        >
          {`Disrupting Forex Industry\nwith Web3 Tech`}
        </span>
      </div>
      <div className={cn("flex", "h-full", "justify-between")}>
        <div className={cn("relative", "w-[489px]", "h-full")}>
          <Image
            className={cn("object-cover", "object-bottom")}
            src="/images/phone-mockup.png"
            alt="Phone mockup"
            fill
          />
        </div>
        <div
          className={cn(
            "grid",
            "max-w-[386px]",
            "flex-1",
            "gap-[32px]",
            "pb-[106px]",
            "self-end",
          )}
        >
          <ul className={cn("grid", "gap-[16px]")}>
            <li>
              <ButtonLink
                text="Pitch Deck"
                iconSrc="/icons/presentation.svg"
                href=""
                external
              />
            </li>
            <li>
              <ButtonLink
                text="Twitter"
                iconSrc="/icons/twitter.svg"
                href=""
                external
              />
            </li>
            <li>
              <ButtonLink
                text="Youtube"
                iconSrc="/icons/youtube.svg"
                href=""
                external
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RootPage;
