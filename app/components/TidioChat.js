"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function TidioChat() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdminUser = window.localStorage.getItem("parhloAdmin") === "true";
      const isAdminRoute = pathname && pathname.startsWith("/admin");
      
      // Load Tidio only if not an admin route and not logged in as admin
      if (!isAdminRoute && !isAdminUser) {
        setShouldLoad(true);
      } else {
        setShouldLoad(false);
      }
    }
  }, [pathname]);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      src="//code.tidio.co/q6gltn3vpijpjvmujkibbe9lsn6dfais.js"
      strategy="lazyOnload"
    />
  );
}
