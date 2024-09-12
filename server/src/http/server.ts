import Fastify from "fastify";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
// import { env } from "../env";

// const client = postgres(env.DATABASE_URL, {
//   ssl: { rejectUnauthorized: false },
//   prepare: false,
// });
// export const db = drizzle(client);

const fastify = Fastify({
  logger: true,
});

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
