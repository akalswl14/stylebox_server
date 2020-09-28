import { intArg, queryField } from "@nexus/schema";

export const getShopSNSLink = queryField("getShopSNSLink", {
  type: "shopSNSManagementThumbnail",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          externalLinks: {
            where: { onBottom: false },
            select: { url: true, linkType: true },
            orderBy: { order: "asc" },
          },
        },
      });
      let FacebookLink, InstagramLink, YoutubeLink;
      if (!queryResult) return null;
      for (const eachLink of queryResult.externalLinks) {
        if (eachLink.linkType == "Facebook") FacebookLink = eachLink.url;
        if (eachLink.linkType == "Instagram") InstagramLink = eachLink.url;
        if (eachLink.linkType == "Youtube") YoutubeLink = eachLink.url;
      }
      return {
        FacebookLink,
        InstagramLink,
        YoutubeLink,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
