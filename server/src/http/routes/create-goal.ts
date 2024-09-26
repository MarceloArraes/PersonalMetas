import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoal } from "../../functions/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/goals",
    {
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number(),
        }),
      },
    },
    async (req) => {
      const { title, desiredWeeklyFrequency } = req.body;
      // const createGoalSchema = z.object({
      //   title: z.string(),
      //   desiredWeeklyFrequency: z.number(),
      // });

      // const body = createGoalSchema.parse(req.body);

      const resultCreateGoals = await createGoal({
        title: title,
        desiredWeeklyFrequency: desiredWeeklyFrequency,
      });
      return resultCreateGoals;
    }
  );
};
