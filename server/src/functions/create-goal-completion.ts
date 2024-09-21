import dayjs from "dayjs";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import { lt, gte, and, count, eq, sql } from "drizzle-orm";

interface CreateGoalCompletionRequest {
  goalId: string;
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const createNewCompletion = await db
    .insert(goalCompletions)
    .values({
      goalId: goalId,
      createdAt: new Date(),
    })
    .returning();

  const goalCOmpletionCounts = await db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as("completionCount"),
      })
      .from(goalCompletions)
      //   .leftJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lt(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const goalAndCompletionSelection = await db
    .with(goalCOmpletionCounts)
    .select({
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${goalCOmpletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goals)
    .leftJoin(goalCOmpletionCounts, eq(goalCOmpletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId));

  const { completionCount, desiredWeeklyFrequency } =
    goalAndCompletionSelection[0];

  if (completionCount >= desiredWeeklyFrequency) {
    console.log("!!!!!!!!!!!!!!!!!!!GREAT MEN, KEEP IT UP!!!!!!!!!!!!!!!!!!!!");
    // throw new Error("Goal not completed enough times this week")
  }

  //   const result = await db
  //     .insert(goalCompletions)
  //     .values({
  //       goalId,
  //     })
  //     .returning();

  //   const goalCompletion = result[0];

  return { goalAndCompletionSelection, createNewCompletion };
  //   return { goalCompletion };
}
