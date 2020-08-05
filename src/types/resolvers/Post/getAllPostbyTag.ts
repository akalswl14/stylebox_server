import { intArg, stringArg, queryField } from "@nexus/schema";

export const getAllPostbyTag = queryField("getAllPostbyTag", {
  type: "Post",
  args: {
    tags: intArg({ list: true, required: true }),
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id } = args;
      let posts: any[] = [],
        tagList: {
          id: number;
        }[] = [];
      if (tags) {
        tags.forEach((eachTag) => {
          tagList.push({ id: eachTag });
        });
      }
      if (id) {
        posts = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: tagList } } },
          orderBy: { createdAt: "desc" },
          take: take,
          cursor: { id },
          skip: skip,
        });
      } else {
        posts = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: tagList } } },
          orderBy: { createdAt: "desc" },
          take: take,
        });
      }
      return posts;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
