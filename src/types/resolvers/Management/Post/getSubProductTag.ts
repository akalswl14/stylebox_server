import { intArg, mutationField, stringArg } from "@nexus/schema";

export const getSubProductTag = mutationField("getSubProductTag", {
  type: "TagManagementThumbnail",
  args: {
    lang: stringArg({ nullable: true }),
    productIds: intArg({ list: true, required: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { productIds } = args;
      let { lang } = args;
      let tags: any = [],
        order = 1;

      let productIdArr: number[] = [];
      if (!lang) lang = "VI";
      if (productIds) {
        for (const productId of productIds) {
          if (productId) productIdArr.push(productId);
        }
      } else {
        return null;
      }

      let productTagResult = await ctx.prisma.product.findMany({
        where: {
          id: { in: productIdArr },
        },
        select: {
          tags: true,
        },
      });

      if (!productTagResult) return null;
      let tagIdArr: number[] = [];

      for (const dataSet of productTagResult) {
        for (const tag of dataSet.tags) {
          tagIdArr.push(tag.id);
        }
      }

      tagIdArr = Array.from(new Set(tagIdArr));

      let tagResult = await ctx.prisma.tag.findMany({
        where: {
          id: { in: tagIdArr },
        },
        orderBy: { id: "asc" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          category: true,
          classId: true,
          Class: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      });

      if (!tagResult) return null;

      for (const tag of tagResult) {
        tags.push({
          tagId: tag.id,
          tagName: tag.names[0].word,
          classId: tag.classId,
          className: tag.Class.names[0].word,
          category: tag.category,
          order,
        });
        order++;
      }

      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
