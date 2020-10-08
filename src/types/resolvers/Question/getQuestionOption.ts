import { queryField } from '@nexus/schema';

export const getQuestionOption = queryField('getQuestionOption', {
  type: 'String',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let settingQueryResult, QuestionOption;

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { QuestionOption: true },
      });

      QuestionOption = settingQueryResult
        ? settingQueryResult.QuestionOption
        : null;

      return QuestionOption ? QuestionOption : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
