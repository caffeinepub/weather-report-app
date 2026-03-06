import { Cloud } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-sky-200 dark:border-sky-800 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cloud className="h-8 w-8 text-sky-600" />
            <h1 className="text-2xl font-bold text-sky-700 dark:text-sky-300">Weather Report</h1>
          </div>
        </div>
      </div>
    </header>
  );
}
