import { arg, intArg, queryField } from '@nexus/schema';

export const updateSettingPopularTags = queryField('updateSettingPopularTags', {
  type: 'Boolean',
  args: {
    popularTags: arg({
      type: 'PopularTagInputType',
      list: true,
      required: true,
    }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { popularTags = [] } = args;
      for (const popularTag of popularTags) {
        await ctx.prisma.tag.update({
          where: { id: popularTag.tagId },
          data: { isRecommendation: popularTag.order },
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
