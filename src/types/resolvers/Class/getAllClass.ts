import { intArg, queryField } from "@nexus/schema";

export const getAllClass = queryField("getAllClass", {
  type: "Class",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      const take = 4;
      const skip = 1;
      let classesData;
      try {
        if (id) {
          classesData = await ctx.prisma.class.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
            include: { names: true, tags: true },
          });
        } else {
          classesData = await ctx.prisma.class.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            include: { names: true, tags: true },
          });
        }
      } catch (e) {
        console.log(e);
      }
      return classesData ? classesData : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
