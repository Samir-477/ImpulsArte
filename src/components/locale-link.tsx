import NextLink from "next/link";
import type { ComponentProps } from "react";
import { visiblePath } from "@/lib/routes";

export default function Link({
  href,
  ...props
}: ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      {...props}
      href={typeof href === "string" ? visiblePath(href) : href}
    />
  );
}
