import dayjs from "dayjs";
import { db } from "../db";
import { goals, goalCompletions } from "../db/schema";
import { eq, lt, gte, ne, and, sql, count } from "drizzle-orm";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export async function getWeekPendingGoals() {
  //   const currentYear = dayjs().year();
  //   const currentWeek = dayjs().week();
  const firstDayOfWeek = dayjs().startOf("week").toDate();
  const lastDayOfWeek = dayjs().endOf("week").toDate();

  const goalsCreateUpToWeek = await db.$with("goals_created_up_to_week").as(
    // db.select().from(goals).where(lt(goals.createdAt, dayjs().startOf('week').toDate()))
    db
      .select({
        id: goals.id,
        title: goals.title,
        createdAt: goals.createdAt,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        // completedAt: goalCompletions.completedAt,
      })
      .from(goals)
      .where(lt(goals.createdAt, lastDayOfWeek))
    //   .where(and(sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`))
  );

  const goalCOmpletionCounts = await db.$with("goal_completion_counts").as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id)
          //   .mapWith(Number)
          .as("completionCount"),
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

  const pendingGoals = await db
    .with(goalsCreateUpToWeek, goalCOmpletionCounts)
    .select({
      id: goalsCreateUpToWeek.id,
      title: goalsCreateUpToWeek.title,
      createdAt: goalsCreateUpToWeek.createdAt,
      desiredWeeklyFrequency: goalsCreateUpToWeek.desiredWeeklyFrequency,
      //   completionCount: goalCOmpletionCounts.completionCount,
      completionCount:
        sql`COALESCE(${goalCOmpletionCounts.completionCount}, 0)`.mapWith(
          Number
        ),
    })
    .from(goalsCreateUpToWeek)
    .leftJoin(
      goalCOmpletionCounts,
      eq(goalCOmpletionCounts.goalId, goalsCreateUpToWeek.id)
    );

  return { pendingGoals };
  //   const result = await db
  //     .select()
  //     .from(goals)
  //     .leftJoin(goalCompletions, eq(goals.id, goalCompletions.goalId));
  //   return result;
}
