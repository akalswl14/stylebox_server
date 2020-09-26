import { arg, mutationField, stringArg } from '@nexus/schema';

export const updateSettingQuestion = mutationField('updateSettingQuestion', {
  type: 'Boolean',
  args: {
    email: stringArg({ nullable: true }),
    pw: stringArg({ nullable: true }),
    questionTypes: arg({
      type: 'QuestionInputType',
      nullable: true,
      list: true,
    }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { questionTypes = [], email, pw } = args;

      if (email) {
        await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { adminEmail: email },
        });
      }

      if (pw) {
        await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { adminEmailPW: pw },
        });
      }

      if (questionTypes.length > 0) {
        await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { QuestionOption: questionTypes },
        });
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
