import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { WeeklySummary } from "./components/weekly-summary";
import { getSummary } from "./http/get-summary";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "./components/ui/dialog";
import brokenStar from "./assets/broken-start.svg";

export function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  if (isLoading || error)
    return (
      <div className="flex flex-1 justify-center items-center min-h-screen">
        <img src={brokenStar} className=" animate-spin-slow" />
      </div>
    );
  console.log("data", data);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8">
      <Dialog>
        {data && data.summary.total > 0 ? (
          <WeeklySummary summary={data.summary} />
        ) : (
          <EmptyGoals />
        )}
        <CreateGoal />
      </Dialog>
    </div>
  );
}
