import { Footer } from "@/components/custom/footer";
import { Header } from "@/components/custom/header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col min-h-screen">
            <Header />
            {children}
            <Footer />
        </main >
    )
}