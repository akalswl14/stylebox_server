import { intArg, queryField } from "@nexus/schema";

export const getAllTag = queryField("getAllTag", {
  type: "Tag",
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
      let tags;
      try {
        if (id) {
          tags = await ctx.prisma.tag.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
            include: { name: true, Category: true },
          });
        } else {
          tags = await ctx.prisma.tag.findMany({
            orderBy: { createdAt: "desc" },
            take: take,
            include: { name: true, Category: true },
          });
        }
        return tags;
      } catch (e) {
        console.log(e);
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
