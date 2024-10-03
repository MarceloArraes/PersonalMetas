import { CreateGoal } from "./components/create-goal";
import { EmptyGoals } from "./components/empty-goals";
import { WeeklySummary } from "./components/weekly-summary";
import brokenStar from "./assets/broken-start.svg";
import { getSummary } from "./http/get-summary";
import { useQuery } from "@tanstack/react-query";
import { Dialog } from "./components/ui/dialog";

export function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  });

  if ((isLoading || error) && data) return <p>Loading...</p>;
  console.log("data", data);
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-8">
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
}
