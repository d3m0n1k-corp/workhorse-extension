import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bottom-0">
      <div className="flex items-center justify-between px-2 mx-10 my-5">
        <div className="grid gap-1">
          <span className="text-sm flex-col items-center">
            ©2025 Gagandeep Singh Bhambrah. All Rights Reserved.
          </span>
        </div>
        <span className="flex-col items-center">
          <a href="https://github.com/d3m0n1k-corp/workhorse-extension">
            <Github size={18} />
          </a>
        </span>
      </div>
    </footer>
  );
}
