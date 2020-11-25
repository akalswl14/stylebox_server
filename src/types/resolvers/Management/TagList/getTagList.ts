import { arg, booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getTagList = queryField("getTagList", {
  type: "TagListThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    tagId: intArg({ nullable: true }),
    tagName: stringArg({ nullable: true }),
    category: arg({ type: "Category", nullable: true }),
    className: stringArg({ nullable: true }),
    tagIdAsc: booleanArg({ nullable: true }),
    tagNameAsc: booleanArg({ nullable: true }),
    categoryAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        tagId,
        tagName,
        category,
        className,
        tagIdAsc,
        tagNameAsc,
        categoryAsc,
      } = args;

      let { pageNum } = args;
      if (!pageNum) pageNum = 1;

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let tagResult;

      let lang = "VI",
        tags = [];

      let orderByOption = {},
        whereOption = {};

      let FirstCapital, AllCapital;

      if (tagId) {
        whereOption = { id: tagId };
      }
      if (tagName) {
        FirstCapital =
          tagName.length > 1
            ? tagName.charAt(0).toUpperCase() + tagName.slice(1)
            : tagName.length === 1
            ? tagName.toUpperCase()
            : "";
        AllCapital = tagName.length >= 1 ? tagName.toUpperCase() : "";
        whereOption = {
          names: {
            some: {
              OR: [
                { word: { startsWith: tagName }, lang },
                { word: { startsWith: FirstCapital }, lang },
                { word: { startsWith: AllCapital }, lang },
              ],
            },
          },
        };
      }
      if (category) {
        whereOption = { category: category };
      }
      if (className) {
        FirstCapital =
          className.length > 1
            ? className.charAt(0).toUpperCase() + className.slice(1)
            : className.length === 1
            ? className.toUpperCase()
            : "";
        AllCapital = className.length >= 1 ? className.toUpperCase() : "";
        whereOption = {
          Class: {
            names: {
              some: {
                OR: [
                  { word: { startsWith: className }, lang },
                  { word: { startsWith: FirstCapital }, lang },
                  { word: { startsWith: AllCapital }, lang },
                ],
              },
            },
          },
        };
      }

      if (typeof tagIdAsc === "boolean") {
        orderByOption = tagIdAsc ? { id: "asc" } : { id: "desc" };
      } else if (typeof categoryAsc === "boolean") {
        orderByOption = categoryAsc
          ? { category: "asc" }
          : { category: "desc" };
      } else {
        orderByOption = [{ id: "asc" }, { category: "asc" }];
      }

      if (typeof tagNameAsc === "boolean") {
        let whereOptionTagResult = await ctx.prisma.tag.findMany({
          where: whereOption,
          select: {
            id: true,
          },
        });

        let tagIdList = [];

        for (const eachtag of whereOptionTagResult) {
          tagIdList.push(eachtag.id);
        }

        let tagNameAscResult = await ctx.prisma.tagName.findMany({
          where: { tagId: { in: tagIdList }, lang: "VI" },
          skip: skipNum,
          take: loadingNum,
          orderBy: tagNameAsc ? { word: "asc" } : { word: "desc" },
          select: { tagId: true },
        });

        if (!tagNameAscResult) return null;

        let tagAscList = [];

        for (const eachtag of tagNameAscResult) {
          if (eachtag.tagId) tagAscList.push(eachtag.tagId);
        }

        for (const id of tagAscList) {
          tagResult = await ctx.prisma.tag.findOne({
            where: { id: id },
            select: {
              id: true,
              names: {
                where: { lang },
                select: { word: true },
              },
              category: true,
              Class: {
                select: { names: { where: { lang }, select: { word: true } } },
              },
            },
          });

          if (!tagResult) return null;

          console.log(tagResult);

          let shopNum = await ctx.prisma.shop.count({
            where: { tags: { some: { id: tagResult.id } } },
          });
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: tagResult.id } } },
          });
          let productNum = await ctx.prisma.product.count({
            where: { tags: { some: { id: tagResult.id } } },
          });

          tags.push({
            tagId: tagResult.id,
            tagName: tagResult.names[0].word,
            category: tagResult.category,
            className: tagResult.Class.names[0].word,
            postNum,
            shopNum,
            productNum,
          });
        }
      } else {
        tagResult = await ctx.prisma.tag.findMany({
          where: whereOption,
          orderBy: orderByOption,
          skip: skipNum,
          take: loadingNum,
          select: {
            id: true,
            names: {
              where: { lang },
              select: { word: true },
            },
            category: true,
            Class: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });

        for (const tag of tagResult) {
          let shopNum = await ctx.prisma.shop.count({
            where: { tags: { some: { id: tag.id } } },
          });
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: tag.id } } },
          });
          let productNum = await ctx.prisma.product.count({
            where: { tags: { some: { id: tag.id } } },
          });

          tags.push({
            tagId: tag.id,
            tagName: tag.names[0].word,
            category: tag.category,
            className: tag.Class.names[0].word,
            postNum,
            shopNum,
            productNum,
          });
        }
      }

      let totalTagNum = await ctx.prisma.tag.count({
        where: whereOption,
      });

      return {
        totalTagNum,
        tags,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
