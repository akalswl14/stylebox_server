import { arg, intArg, mutationField } from "@nexus/schema";
import { Context } from "vm";

export const getTagsbyShop = mutationField("getTagsbyShop", {
  type: "TagManagementThumbnail",
  args: {
    shopId: intArg({ required: true }),
    tags: intArg({ required: true, list: [true] }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopId, tags } = args;
      const tmpTags = tags.map((eachTag, index) => ({
        id: eachTag,
        order: index + 1,
      }));
      const originalTagInfoList = await getTagInformation(ctx, tmpTags);
      let rtnTags = [...originalTagInfoList];
      const shopResult = await ctx.prisma.shop.findOne({
        where: { id: shopId },
        select: { onDetailTagId: true },
      });
      if (shopResult) {
        const shopTags = shopResult.onDetailTagId.map((eachTag, index) => ({
          id: eachTag,
          order: rtnTags.length + index + 1,
        }));
        const shopTagInfoList = await getTagInformation(ctx, shopTags);
        rtnTags = [...rtnTags, ...shopTagInfoList];
      }
      return rtnTags;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});

const getTagInformation = async (
  ctx: Context,
  tags: {
    id: number;
    order: number;
  }[]
) => {
  const lang = "VI";
  const rtnTags = [];
  for (const eachTag of tags) {
    if (!eachTag.id) continue;
    const tagResult = await ctx.prisma.tag.findOne({
      where: { id: eachTag.id },
      select: {
        names: { where: { lang }, select: { word: true } },
        classId: true,
        category: true,
      },
    });
    if (!tagResult) continue;
    if (tagResult.names.length <= 0) continue;
    const classResult = await ctx.prisma.className.findMany({
      where: { classId: tagResult.classId, lang },
      select: { word: true },
    });
    if (!classResult || classResult.length <= 0 || !classResult[0].word) {
      continue;
    }
    rtnTags.push({
      tagId: eachTag.id,
      tagName: tagResult.names[0].word,
      classId: tagResult.classId,
      className: classResult[0].word,
      category: tagResult.category,
      order: eachTag.order,
    });
  }
  return rtnTags;
};
