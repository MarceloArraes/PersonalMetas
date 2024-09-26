import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { createGoalCompletion } from "../../functions/create-goal-completion";

export const createCompletionRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/complete-goal",
    {
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { goalId } = request.body;
      // I could not send the message back. Would be more standard to return just the status 200;
      const completedGoal = createGoalCompletion({ goalId });
      return completedGoal;
    }
  );
};
