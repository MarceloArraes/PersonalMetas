import { SelectedFieldsFlat } from "drizzle-orm";
import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

const seed = async () => {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db
    .insert(goals)
    .values([
      {
        title: "Wake up early",
        desiredWeeklyFrequency: 6,
      },
      {
        title: "Meditate",
        desiredWeeklyFrequency: 2,
      },
      {
        title: "Study",
        desiredWeeklyFrequency: 4,
      },
      {
        title: "Exercise",
        desiredWeeklyFrequency: 2,
      },
    ])
    .returning();

  await db.insert(goalCompletions).values([
    {
      goalId: result[0].id,
      createdAt: dayjs().startOf("week").toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: dayjs().startOf("day").toDate(),
    },
    {
      goalId: result[2].id,
      createdAt: dayjs().startOf("week").add(2, "day").toDate(),
    },
    {
      goalId: result[3].id,
      createdAt: dayjs().startOf("week").add(2, "day").toDate(),
    },
  ]);
};

seed().finally(() => {
  client.end();
});
