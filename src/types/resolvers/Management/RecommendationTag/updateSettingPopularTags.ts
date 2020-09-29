import { arg, mutationField } from '@nexus/schema';

export const updateSettingPopularTags = mutationField(
  'updateSettingPopularTags',
  {
    type: 'Boolean',
    args: {
      popularTags: arg({
        type: 'PopularTagInputType',
        list: true,
        required: true,
      }),
    },
    nullable: false,
    resolve: async (_, args, ctx) => {
      try {
        const { popularTags = [] } = args;
        await ctx.prisma.tag.updateMany({
          where: { isRecommendation: { gte: 1 } },
          data: { isRecommendation: 0 },
        });
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
  }
);
