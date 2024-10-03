import { Plus } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

import gladius from "../assets/gladius.svg";
// import rocketLaunchIllustration from "../assets/rocket-launch-illustration.svg";
import brokenStar from "../assets/broken-start.svg";
import { Button } from "./ui/button";

export function EmptyGoals() {
  return (
    <main className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={gladius} alt="in.orbit" />

      <img
        src={brokenStar}
        alt="Ilustração de uma mulher controlando um lançamento de um foguete através de um controle remoto"
      />

      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora
        mesmo?
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
