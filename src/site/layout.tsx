import { Footer } from '@/components/structure/footer';
import { Header } from '@/components/structure/header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
