import { intArg, mutationField } from "@nexus/schema";

export const deleteSelectedTags = mutationField("deleteSelectedTags", {
  type: "Boolean",
  args: {
    tagIds: intArg({ list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagIds = [] } = args;
      let deleteQuery;
      let TagIds = [];

      for (const eachItem of tagIds) {
        if (eachItem) TagIds.push(eachItem);
      }

      deleteQuery = await ctx.prisma.tagName.deleteMany({
        where: { tagId: { in: TagIds } },
      });
      deleteQuery = await ctx.prisma.searchTagLog.deleteMany({
        where: { tagId: { in: TagIds } },
      });

      let productTagResult = await ctx.prisma.product.findMany({
        where: { tags: { some: { id: { in: TagIds } } } },
        select: {
          id: true,
          onDetailTagId: true,
        },
      });

      if (productTagResult) {
        for (const product of productTagResult) {
          let saveList = product.onDetailTagId.slice();
          for (const id of product.onDetailTagId) {
            if (tagIds.indexOf(id) >= 0) {
              const idx = saveList.indexOf(id);
              if (idx > -1) saveList.splice(idx, 1);
            }
          }
          await ctx.prisma.product.update({
            where: { id: product.id },
            data: { onDetailTagId: { set: saveList } },
          });
        }
      }

      let shopTagResult = await ctx.prisma.shop.findMany({
        where: { tags: { some: { id: { in: TagIds } } } },
        select: {
          id: true,
          onDetailTagId: true,
        },
      });

      if (shopTagResult) {
        for (const shop of shopTagResult) {
          let saveList = shop.onDetailTagId.slice();
          for (const id of shop.onDetailTagId) {
            if (tagIds.indexOf(id) >= 0) {
              const idx = saveList.indexOf(id);
              if (idx > -1) saveList.splice(idx, 1);
            }
          }
          await ctx.prisma.shop.update({
            where: { id: shop.id },
            data: { onDetailTagId: { set: saveList } },
          });
        }
      }

      let postTagResult = await ctx.prisma.post.findMany({
        where: { tags: { some: { id: { in: TagIds } } } },
        select: {
          id: true,
          onDetailTagId: true,
        },
      });

      if (postTagResult) {
        for (const post of postTagResult) {
          let saveList = post.onDetailTagId.slice();
          for (const id of post.onDetailTagId) {
            if (tagIds.indexOf(id) >= 0) {
              const idx = saveList.indexOf(id);
              if (idx > -1) saveList.splice(idx, 1);
            }
          }
          await ctx.prisma.post.update({
            where: { id: post.id },
            data: { onDetailTagId: { set: saveList } },
          });
        }
      }

      let settingTagResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: {
          mainBubbleTagId: true,
          bestBubbleTagId: true,
          shopBubbleTagId: true,
        },
      });

      if (!settingTagResult) return false;

      let mainBubbleList = settingTagResult.mainBubbleTagId.slice();
      for (const id of settingTagResult.mainBubbleTagId) {
        if (tagIds.indexOf(id) >= 0) {
          const idx = mainBubbleList.indexOf(id);
          if (idx > -1) mainBubbleList.splice(idx, 1);
        }
      }
      let mainBubbleUpdate = await ctx.prisma.setting.update({
        where: { id: 1 },
        data: { mainBubbleTagId: { set: mainBubbleList } },
      });

      let bestBubbleList = settingTagResult.bestBubbleTagId.slice();
      for (const id of settingTagResult.bestBubbleTagId) {
        if (tagIds.indexOf(id) >= 0) {
          const idx = bestBubbleList.indexOf(id);
          if (idx > -1) bestBubbleList.splice(idx, 1);
        }
      }
      let bestBubbleUpdate = await ctx.prisma.setting.update({
        where: { id: 1 },
        data: { bestBubbleTagId: { set: bestBubbleList } },
      });

      let shopBubbleList = settingTagResult.shopBubbleTagId.slice();
      for (const id of settingTagResult.shopBubbleTagId) {
        if (tagIds.indexOf(id) >= 0) {
          const idx = shopBubbleList.indexOf(id);
          if (idx > -1) shopBubbleList.splice(idx, 1);
        }
      }
      let shopBubbleUpdate = await ctx.prisma.setting.update({
        where: { id: 1 },
        data: { shopBubbleTagId: { set: shopBubbleList } },
      });

      let queryResult = await ctx.prisma.tag.deleteMany({
        where: { id: { in: TagIds } },
      });

      if (
        !queryResult ||
        !deleteQuery ||
        !shopBubbleUpdate ||
        !bestBubbleUpdate ||
        !mainBubbleUpdate
      )
        return false;

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
