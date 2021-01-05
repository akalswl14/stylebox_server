import { arg, intArg, mutationField, stringArg } from "@nexus/schema";
import { vietnamese } from "vietnamese-js";

export const createTagInfo = mutationField("createTagInfo", {
  type: "TagIdInfo",
  args: {
    tagName: stringArg({ required: true }),
    tagCategory: arg({ type: "Category", required: true }),
    tagImage: stringArg({ nullable: true }),
    classId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tagName, tagCategory, tagImage, classId } = args;
      let lang;
      if (!lang) lang = "VI";

      let queryResult = await ctx.prisma.tag.create({
        data: {
          category: tagCategory,
          isClass: false,
          isRecommendation: 0,
          Class: { connect: { id: classId } },
          names: {
            create: {
              lang,
              word: tagName,
              searchWord: vietnamese(tagName).toLowerCase(),
            },
          },
        },
        select: {
          id: true,
        },
      });

      if (!queryResult) return null;

      if (tagImage) {
        const s3ImageKey = "Tag/" + queryResult.id + "/" + tagImage;

        let createImage = await ctx.prisma.tag.update({
          where: { id: queryResult.id },
          data: { tagImage: s3ImageKey },
        });

        if (!createImage) return null;
      }

      return queryResult ? { tagId: queryResult.id } : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
