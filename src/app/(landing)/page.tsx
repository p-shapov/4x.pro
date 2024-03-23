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
        "mobile:grid-rows-[max-content_max-content]",
        "not_mobile:grid-rows-[max-content_1fr]",
        "mobile:content-center",
        "max-w-[1280px]",
        "items-between",
        "w-full",
        "mx-auto",
        "px-[40px]",
        "pt-[60px]",
        "h-[100vh]",
        "overflow-hidden",
      )}
    >
      <div
        className={cn(
          "flex",
          "flex-nowrap",
          "desktop:justify-between",
          "not_desktop:flex-col",
          "gap-[32px]",
          "mb-[70px]",
        )}
      >
        <div
          className={cn(
            "relative",
            "w-full",
            "max-w-[798px]",
            "aspect-[798/66]",
            "mobile:mx-auto",
          )}
        >
          <Image src="/images/logo.svg" alt="4X logo" fill />
        </div>
        <span
          className={cn(
            "font-[family-name:var(--unbounded-text-font)]",
            "font-[200]",
            "not_phone:text-[2.4rem]",
            "phone:text-[1.6rem]",
            "mobile:text-center",
            "leading-[1.6]",
            "text-white",
            "whitespace-pre-wrap",
          )}
        >
          {`Disrupting Forex Industry\nwith Web3 Tech`}
        </span>
      </div>
      <div className={cn("flex", "h-full", "justify-between", "gap-[32px]")}>
        <div className={cn("phone:hidden", "tablet:hidden")}>
          <Image
            className={cn(
              "absolute",
              "bottom-0",
              "object-cover",
              "object-top",
              "w-full",
              "w-[34%]",
              "max-w-[489px]",
              "aspect-[489/598]",
            )}
            src="/images/phone-mockup.png"
            alt="Phone mockup"
            width={489}
            height={598}
          />
        </div>
        <div
          className={cn(
            "grid",
            "mobile:w-full",
            "mobile:max-w-[386px]",
            "mobile:mx-auto",
            "not_mobile:w-[386px]",
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
