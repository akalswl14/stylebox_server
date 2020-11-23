import { queryField, stringArg } from "@nexus/schema";

export const getTagDuplication = queryField("getTagDuplication", {
  type: "Boolean",
  args: { tagName: stringArg({ required: true }) },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagName } = args;
      let lang;
      if (!lang) lang = "VI";

      let tagNameResult = await ctx.prisma.tagName.findMany({
        where: { lang },
        select: { word: true },
      });

      if (!tagNameResult) return false;

      const tagNameArr: string[] = [];
      for (const eachItem of tagNameResult) {
        tagNameArr.push(eachItem.word);
      }

      const check = !tagNameArr.includes(tagName) ? true : false;

      return check;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
