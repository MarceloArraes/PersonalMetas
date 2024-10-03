# About Postgres Database

- the docker-compose is to be used on creating the local postgres database.
- remember that I could create a DB on the neon.tech too instead of supabase...

## commands on Backend

- To populate the database with the schema.ts file, we need to run the following commands:
- `npx drizzle-kit generate`
- `npx drizzle-kit migrate`
- `npx drizzle-kit studio`
- Use of SQL WITH (Common Table Expression) in Drizzle
  - We make a subquery for the usage of the bigger query
- Use the `.mapWith(Number),` to convert text in number.
- Use COASLESCE inside the `sql` function of drizzle to do a ?? Nullish Coalescing Operator.
- This is a secret to force a refetch without using the refetch itself:```
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })
    queryClient.invalidateQueries({ queryKey: ['summary'] }) ```
  - This way i also don't need to use the keys on the queryKeys to 'force' the update.
- Infer type from zod schema:
  - `type CreateGoalSchema = z.infer<typeof createGoalSchema>`
