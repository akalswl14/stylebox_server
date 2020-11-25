import { intArg, queryField } from "@nexus/schema";
import { LinkType } from "@prisma/client";

export const getPostExternalLink = queryField("getPostExternalLink", {
  type: "PostExternalLink",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;

      let links: any = [];

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

      let Links: {
        linkType: LinkType;
        url: string;
        isShown: boolean;
        order: number;
      }[] = [];

      for (const link of links) {
        if (link) {
          if (link.linkType && link.url && link.order) {
            Links.push({
              url: link.url,
              linkType: link.linkType,
              isShown: link.isShown ? true : false,
              order: link.order,
            });
          }
        }
      }

      Links.sort((a, b) =>
        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
      );

      links = [];
      for (const link of Links) {
        links.push(link);
      }

      return links ? links : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
