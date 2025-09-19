import Link from 'next/link';
import { MopedIcon } from '@/components/icons';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <MopedIcon className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">Ghana Must Go</span>
          </Link>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Ghana Must Go. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
