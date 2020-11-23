import { queryField, stringArg } from "@nexus/schema";

export const getClassDuplication = queryField("getClassDuplication", {
  type: "Boolean",
  args: { className: stringArg({ required: true }) },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { className } = args;
      let lang;
      if (!lang) lang = "VI";

      let classNameResult = await ctx.prisma.className.findMany({
        where: { lang },
        select: { word: true },
      });

      if (!classNameResult) return false;

      const classNameArr: string[] = [];
      for (const eachItem of classNameResult) {
        classNameArr.push(eachItem.word);
      }

      const check = !classNameArr.includes(className) ? true : false;

      return check;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
