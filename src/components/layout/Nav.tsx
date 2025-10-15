import Link from "next/link";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import content from "@/data/content.json";

export function Nav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 cursor-pointer"
        >
          <MenuIcon className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-60">
        <SheetHeader>
          <SheetTitle>AICE2025</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 p-4">
          {content.nav.map((item) => (
            <Button key={item.name} asChild>
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
