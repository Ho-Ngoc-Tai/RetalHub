import ReduxProviders from "@/app/components/providers";


export default function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProviders>
            {children}
        </ReduxProviders>
    );
}