import { intArg, queryField } from "@nexus/schema";

export const getAllCategory = queryField("getAllCategory", {
  type: "Category",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      const take = 4;
      const skip = 1;
      let categories;
      try {
        if (id) {
          categories = await ctx.prisma.category.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
            include: { name: true, tags: true },
          });
        } else {
          categories = await ctx.prisma.category.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            include: { name: true, tags: true },
          });
        }
        return categories;
      } catch (e) {
        console.log(e);
      }
      if (categories) {
        return categories;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
