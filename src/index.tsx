import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  APP_INIT_ERROR,
  APP_READY,
  subscribe,
  initialize,
  mergeConfig,
} from "@edx/frontend-platform";
import { AppProvider, ErrorPage } from "@edx/frontend-platform/react";
import { CustomFooter, CustomHeader } from "@minhduchg454/cusc-custom-brand";
import messages from "./i18n";
import PaymentHistoryPage from "./payment-history/PaymentHistoryPage";
import {
  primaryNav,
  ctuLogoImgSrc,
  cuscLogoImgSrc,
} from "./payment-history-header/payment-history-header";

subscribe(APP_READY, () => {
  const queryClient = new QueryClient();
  const container = document.getElementById("root");
  const root = createRoot(container!);

  const primary = primaryNav();
  const cuscLogo = cuscLogoImgSrc();
  const ctuLogo = ctuLogoImgSrc();

  const logoRedirectURL = [
    { firstLogo: "https://www.ctu.edu.vn/" },
    { secondLogo: "https://cusc.ctu.edu.vn/cms/" },
  ];

  root.render(
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <main style={{ minHeight: "80vh", padding: "20px" }}>
          <CustomHeader
            firstLogo={ctuLogo}
            secondLogo={cuscLogo}
            primaryNav={primary}
            secondaryNav={[]}
            twoLogo
          />
          <Routes>
            <Route path="/" element={<PaymentHistoryPage />} />
            <Route path="*" element={<div>404 - Không tìm thấy trang</div>} />
          </Routes>
        </main>
        <CustomFooter
          firstLogo={cuscLogo}
          secondLogo={ctuLogo}
          firstLogoRedirectURL={logoRedirectURL.secondLogo}
          secondLogoRedirectURL={logoRedirectURL.firstLogo}
        />
      </QueryClientProvider>
    </AppProvider>,
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  messages,
  handlers: {
    config: () => {
      mergeConfig(
        {
          SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
          SUPPORT_URL: process.env.SUPPORT_URL,
          TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL,
          PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL,
          ENABLE_ACCESSIBILITY_PAGE:
            process.env.ENABLE_ACCESSIBILITY_PAGE === "true",
          SITE_NAME: process.env.SITE_NAME,
        },
        "Cấu hình hệ thống",
      );
    },
  },
  requireAuthenticatedUser: true,
  hydrateAuthenticatedUser: true,
});
