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

      for (const productId of productIdArr) {
        let productTagResult = await ctx.prisma.product.findOne({
          where: {
            id: productId,
          },
          select: {
            onDetailTagId: true,
          },
        });

        if (!productTagResult) return null;

        for (const tagId of productTagResult.onDetailTagId) {
          let tagResult = await ctx.prisma.tag.findOne({
            where: {
              id: tagId,
            },
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

          tags.push({
            tagId: tagResult.id,
            tagName: tagResult.names[0].word,
            classId: tagResult.classId,
            className: tagResult.Class.names[0].word,
            category: tagResult.category,
            order: order++,
          });
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
