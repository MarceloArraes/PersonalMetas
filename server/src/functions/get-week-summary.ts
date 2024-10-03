import dayjs from "dayjs";
import { db } from "../db";
import { goals, goalCompletions } from "../db/schema";
import { eq, lt, gte, and, sql, count } from "drizzle-orm";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export async function getWeekSummary() {
  const lastDayOfWeek = dayjs().endOf("week").toDate();
  const firstDayOfWeek = dayjs().startOf("week").toDate();

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

  const goalsCompletedInWeek = await db.$with("goals_completed_in_week").as(
    db
      .select({
        id: goalCompletions.id,
        // goalId: goals.id,
        title: goals.title,
        completedAt: goalCompletions.createdAt,
        completedAtDate: sql/*sql*/ `
        DATE(${goalCompletions.createdAt})
        `.as("completedAtDate"),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      //   .leftJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lt(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
  );

  type GoalsPerDay = {
    [key: string]: { id: string; title: string; completedAt: string }[];
  };

  const goalsCompletedByWeekDay = await db
    .$with("goals_completed_by_weekday")
    .as(
      db
        .select({
          completedAtDate: goalsCompletedInWeek.completedAtDate,
          completions: sql/* sql */ `
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', ${goalsCompletedInWeek.id},
                'title', ${goalsCompletedInWeek.title},
                'completedAt', ${goalsCompletedInWeek.completedAt}
              
              )
            )
          `.as("completions"),
          // count: count(goalsCompletedInWeek.goalId).as("count"),
          // weekDay: sql`EXTRACT(DOW FROM ${goalsCompletedInWeek.completedAtDate})`,
        })
        .from(goalsCompletedInWeek)
        // .groupBy(sql`EXTRACT(DOW FROM ${goalsCompletedInWeek.completedAtDate})`)
        .groupBy(goalsCompletedInWeek.completedAtDate)
    );
  const [summary] = await db
    // const result = await db
    .with(goalsCreateUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed:
        sql/* sql */ `(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
          Number
        ),
      total:
        sql/* sql */ `(SELECT SUM(${goalsCreateUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreateUpToWeek})`.mapWith(
          Number
        ),
      goalsPerDay: sql/* sql */ <GoalsPerDay>`JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )`,
    })
    .from(goalsCompletedByWeekDay);

  return {
    summary,
  };
}
