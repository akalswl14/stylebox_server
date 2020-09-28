import { intArg, queryField } from "@nexus/schema";

export const getShopExternalLink = queryField("getShopExternalLink", {
  type: "linkManagementThumbnail",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          externalLinks: {
            where: { onBottom: true },
            select: { order: true, url: true, isShown: true, linkType: true },
            orderBy: { order: "asc" },
          },
        },
      });
      return queryResult?.externalLinks;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
