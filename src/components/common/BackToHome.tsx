import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowLeftIcon } from "lucide-react";
import content from "@/data/content.json";

export default function BackToHome() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="group rounded-full cursor-pointer col-span-2"
          asChild
        >
          <Link href="/" className="px-12 py-6 flex gap-2 items-center text-xl">
            <ArrowLeftIcon className="size-4 group-hover:-translate-x-1 transition-all" />
            Back
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent>{content.pages.back}</TooltipContent>
    </Tooltip>
  );
}
