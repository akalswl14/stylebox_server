import { intArg, queryField, stringArg } from "@nexus/schema";

export const searchTag = queryField("searchTag", {
  type: "Tag",
  args: {
    id: intArg({ nullable: true }),
    word: stringArg({ required: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor and word argument is for TagName.",
  resolve: async (_, args, ctx) => {
    try {
      const { id, word } = args;
      let tags;
      try {
        if (id) {
          tags = await ctx.prisma.tag.findMany({
            where: { names: { some: { word: { contains: word } } } },
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          tags = await ctx.prisma.tag.findMany({
            where: { names: { some: { word: { contains: word } } } },
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
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
