import { Plus, X } from "lucide-react";
import galea from "./assets/galea.svg";
import gladius from "./assets/gladius.svg";
import wreath from "./assets/wreath.svg";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "./components/ui/radio-group";
import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { WeeklySummary } from "./components/weekly-summary";
import brokenStar from "./assets/broken-start.svg";
import { getSummary } from "./http/get-summary";
import { useQuery } from "@tanstack/react-query";

export function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getSummary,
  });

  if ((isLoading || error) && data) return <p>Loading...</p>;
  console.log("data", data);
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-8">
      <Dialog>
        <img src={brokenStar} alt="broken" />
        {data && data.summary.total > 0 ? (
          <WeeklySummary summary={data.summary} />
        ) : (
          <EmptyGoals />
        )}
        <CreateGoal />
      </Dialog>
    </div>
  );
  return (
    <Dialog>
      <div className="h-screen flex flex-col justify-center items-center gap-8">
        <h1 className="bg-black text-white text-3xl">Hello world</h1>

        <img src={galea} alt="Galea Logo" />

        <img src={gladius} alt="Galea Logo" />
        <img src={wreath} alt="Galea Logo" />
        <p className="text-zinc-300 leading-relaxed max-w-80 text-center ">
          You didnt made any goals
        </p>
        <DialogTrigger asChild>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Make New Goal
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <div className="gap-flex flex-col gap-6 h-full">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <DialogTitle>Create Goal</DialogTitle>
              <DialogClose>
                <X className="w-4 h-4" />
              </DialogClose>
            </div>
            <DialogDescription>
              Add activities that you would like to keep up doing repetealy like
              a routine habit.
            </DialogDescription>
          </div>
          <form
            action=""
            className="flex flex-1 flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">What is the activity</Label>
                <Input
                  id="title"
                  autoFocus
                  placeholder="Study, exercise, others.."
                  autoComplete="off"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">How many times a week?</Label>
                <RadioGroup>
                  <RadioGroupItem value="1">
                    <RadioGroupIndicator />
                    <span className="text-zinc-300 text-sm font-medium leading-none">
                      1x
                    </span>
                    <span>icon</span>
                  </RadioGroupItem>

                  <RadioGroupItem value="2">
                    <RadioGroupIndicator />
                    <span className="text-zinc-300 text-sm font-medium leading-none">
                      2x
                    </span>
                    <span>icon</span>
                  </RadioGroupItem>

                  <RadioGroupItem value="3">
                    <RadioGroupIndicator />
                    <span className="text-zinc-300 text-sm font-medium leading-none">
                      3x
                    </span>
                    <span>icon</span>
                  </RadioGroupItem>

                  <RadioGroupItem value="4">
                    <RadioGroupIndicator />
                    <span className="text-zinc-300 text-sm font-medium leading-none">
                      4x
                    </span>
                    <span>icon</span>
                  </RadioGroupItem>
                </RadioGroup>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button type="button" className="flex-1" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" className="flex-1">
                Save
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
