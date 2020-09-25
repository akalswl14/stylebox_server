import { intArg, queryField } from '@nexus/schema';

export const getTagInfo = queryField('getTagInfo', {
  type: 'TagInfo',
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
