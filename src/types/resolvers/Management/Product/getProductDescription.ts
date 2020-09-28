import { intArg, queryField } from "@nexus/schema";

export const getProductDescription = queryField("getProductDescription", {
  type: "String",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.product.findOne({
        where: { id },
        select: {
          description: true,
        },
      });
      return queryResult?.description;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
