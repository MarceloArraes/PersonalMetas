import Fastify from "fastify";
import z from "zod";
import { createGoal } from "../functions/create-goal";
import { getWeekPendingGoals } from "../functions/get-week-pending-goals";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { createGoalCompletion } from "../functions/create-goal-completion";
import { createGoalRoute } from "./routes/create-goal";
import { createCompletionRoute } from "./routes/create-completion";
import { getPendingGoalsRoute } from "./routes/get-pending-goals";
import { getWeekSummaryRoute } from "./routes/get-week-summary";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);
fastify.register(createGoalRoute);
fastify.register(createCompletionRoute);
fastify.register(getPendingGoalsRoute);
fastify.register(getWeekSummaryRoute);

fastify.get("/", async (request, reply) => {
  return "HELLO WORLD";
  return { hello: "world" };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3333 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
