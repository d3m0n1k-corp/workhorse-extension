import { EmptyHeader } from "../ui/empty-header";
import { CodeXml } from 'lucide-react';

export function Header({ className }: { className?: string }) {
    return (
        <EmptyHeader className={"mx-10 my-3 " + className} heading={
            < span className="inline-flex" >
                <CodeXml size={42} />
                <span className="mx-2" >WorkHorse</span>
            </span >
        } >
            <div className="flex space-x-4">
                <a href="https://github.com/d3m0n1k-corp/workhorse-extension/wiki">Documentation</a>
                <a href="https://buymeacoffee.com/gdsbhambrah">Support</a>
            </div>
        </EmptyHeader >
    )
}