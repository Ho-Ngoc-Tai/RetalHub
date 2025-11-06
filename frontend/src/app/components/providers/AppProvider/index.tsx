import ReduxProviders from "@/app/components/providers";
import { NotifyProvider } from "@/app/components/containers/common/Notify/NotifiProvider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotifyProvider>
      <ReduxProviders>
        {children}
      </ReduxProviders>
    </NotifyProvider>
  );
}