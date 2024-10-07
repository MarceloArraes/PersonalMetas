import { Plus } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

// import rocketLaunchIllustration from "../assets/rocket-launch-illustration.svg";
import brokenStar from "../assets/broken-start.svg";
import { Button } from "./ui/button";

export function EmptyGoals() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={brokenStar} alt="broken start of soviet union" />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        You didn't create any 🎯 goals yet. Start now and boost your
        productivity!
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Create Goal 🎯
        </Button>
      </DialogTrigger>
    </main>
  );
}
