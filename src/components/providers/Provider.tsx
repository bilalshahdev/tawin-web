import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { SidebarProvider } from "../ui/sidebar";
import ReduxProvider from "./ReduxProvider";
import ReactQueryProvider from "./QueryProvider";
import { Toaster } from "../ui/sooner";

const Providers = async ({ children }: { children: React.ReactNode }) => {
  const messages = await getMessages();
  return (
    <ReactQueryProvider>
      <ReduxProvider>
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </NextIntlClientProvider>
      </ReduxProvider>
    </ReactQueryProvider>
  );
};

export default Providers;