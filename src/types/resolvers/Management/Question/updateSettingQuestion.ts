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
        questionTypes.sort(function (
          a: { order: number },
          b: { order: number }
        ) {
          return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
        });
        let questionOptions = [];
        questionOptions.push(questionTypes.questionType);
        await ctx.prisma.setting.update({
          where: { id: 1 },
          data: { QuestionOption: { set: questionOptions } },
        });
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
