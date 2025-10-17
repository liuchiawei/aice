import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

export default function BackToHome() {
  return (
    <Button className="group text-xl rounded-full cursor-pointer" asChild>
      <Link href="/" className="px-8 py-6 flex gap-2 items-center"> 
        <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-all" />
        Back
      </Link>
    </Button>
  );
}