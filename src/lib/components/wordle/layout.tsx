import { Component } from "@/lib/components/utils/component";
import { PropsWithChildren, ReactElement } from "react";
import Image from "next/image";

type LayoutProps = {
  imageSrc?: string;
  imageAlt?: string;
  subtitle?: ReactElement | string;
}

export const WordleLayout: Component<PropsWithChildren & LayoutProps> = ({ children, imageSrc, imageAlt, subtitle }) => {
  return (
    <div className="justify-center mx-auto w-full px-4 sm:px-0 sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-6/12 mt-5 sm:mt-10 md:mt-20">
      <div>
        <Image
          src={imageSrc ?? "/_static/images/wordle_title.png"}
          alt={imageAlt ?? "Wordle"}
          width={400}
          height={69.27}
          className="justify-center mx-auto"
        />
        
        {typeof subtitle === "string" ? <p className="text-center text-muted-foreground -mt-5">{subtitle}</p> : subtitle}
      </div>

      <div className="mt-5">
        {children}
      </div>
    </div>
  )
}