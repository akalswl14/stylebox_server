import { intArg, queryField } from '@nexus/schema';

export const getPostImages = queryField('getPostImages', {
  type: 'UrlOrder',
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let images = [];

      let imageResult = await ctx.prisma.post.findOne({
        where: { id },
        select: { images: { select: { order: true, url: true } } },
      });

      if (!imageResult) return null;

      for (const image of imageResult.images) {
        images.push({
          order: image.order,
          url: image.url,
        });
      }

      return images ? images : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
