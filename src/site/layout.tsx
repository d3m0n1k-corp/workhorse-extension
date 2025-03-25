import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {/* <SidebarTrigger className="min-w-full justify-items-start flex-col" /> */}
            <main>
                {children}
            </main>
        </SidebarProvider>
    )
}