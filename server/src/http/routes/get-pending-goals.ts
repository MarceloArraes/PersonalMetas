import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../../functions/get-week-pending-goals";

export const getPendingGoalsRoute: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get("/goals", async (request, reply) => {
    return await getWeekPendingGoals();
  });
};
