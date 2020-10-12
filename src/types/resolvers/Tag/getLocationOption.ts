import { queryField, stringArg } from "@nexus/schema";

export const getLocationOption = queryField("getLocationOption", {
  type: "TagThumbnail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "VI" } = args;
      // let nameResult,
      //   tagResult,
      //   tags = [];
      // nameResult = await ctx.prisma.tagName.findMany({
      //   where: { lang, Tag: { category: "Location" } },
      //   select: { word: true, tagId: true },
      //   orderBy: { word: "asc" },
      // });
      // if (!nameResult) return null;
      // for (const eachName of nameResult) {
      //   if (eachName.tagId) {
      //     tagResult = await ctx.prisma.tag.findOne({
      //       where: { id: eachName.tagId },
      //       select: {
      //         isClass: true,
      //       },
      //     });
      //     if (tagResult) {
      //       tags.push({
      //         id: eachName.tagId,
      //         tagName: eachName.word,
      //         isClass: tagResult.isClass,
      //       });
      //     }
      //   }
      // }
      let nameResult,
        tags = [];
      nameResult = await ctx.prisma.tagName.findMany({
        where: { lang, Tag: { category: "Location" } },
        select: { word: true, tagId: true, Tag: { select: { isClass: true } } },
        orderBy: { word: "asc" },
      });
      if (!nameResult) return null;
      let order = 0;
      for (const eachName of nameResult) {
        if (eachName.tagId) {
          tags.push({
            id: eachName.tagId,
            tagName: eachName.word,
            isClass: eachName.Tag.isClass,
            order,
          });
          order++;
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
