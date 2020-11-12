import { intArg, queryField } from "@nexus/schema";

export const getClassInfo = queryField("getClassInfo", {
  type: "ClassInfo",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let lang;
      if (!lang) lang = "VI";

      let classResult = await ctx.prisma.class.findOne({
        where: { id },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          category: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!classResult) return null;

      let postNum = await ctx.prisma.post.count({
        where: { tags: { some: { classId: id } } },
      });

      let shopNum = await ctx.prisma.shop.count({
        where: { tags: { some: { classId: id } } },
      });

      let productNum = await ctx.prisma.product.count({
        where: { tags: { some: { classId: id } } },
      });

      let classInfo = {
        classId: classResult.id,
        className: classResult.names[0].word,
        category: classResult.category,
        postNum,
        shopNum,
        productNum,
        createdAt: classResult.createdAt,
        updatedAt: classResult.updatedAt,
      };

      return classInfo ? classInfo : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
