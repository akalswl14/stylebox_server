import { intArg, mutationField, stringArg } from "@nexus/schema";

export const getProdDescription = mutationField("getProdDescription", {
  type: "String",
  args: {
    lang: stringArg({ nullable: true }),
    mainProductId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { mainProductId } = args;
      let { lang } = args;
      if (!lang) lang = "VI";

      let resultQuery = await ctx.prisma.product.findOne({
        where: { id: mainProductId },
        select: { description: true },
      });

      if (!resultQuery) return null;
      return resultQuery ? resultQuery.description : "";
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
