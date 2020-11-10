import { intArg, queryField } from "@nexus/schema";

export const getPostExternalLink = queryField("getPostExternalLink", {
  type: "PostExternalLink",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let links = [];

      let externalLink = await ctx.prisma.post.findOne({
        where: { id },
        select: {
          postExternalLinks: {
            select: { linkType: true, url: true, isShown: true, order: true },
          },
        },
      });

      if (!externalLink) return null;

      for (const link of externalLink.postExternalLinks) {
        links.push({
          linkType: link.linkType,
          url: link.url,
          isShown: link.isShown,
          order: link.order,
        });
      }

      links.sort(function (a, b) {
        return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
      });

      return links ? links : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
