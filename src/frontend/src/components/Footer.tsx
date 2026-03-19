import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-sky-200 dark:border-sky-800 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2025. Built with{" "}
          <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
