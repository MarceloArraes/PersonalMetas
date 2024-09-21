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

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.get("/goals", async (request, reply) => {
  return await getWeekPendingGoals();
});

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
