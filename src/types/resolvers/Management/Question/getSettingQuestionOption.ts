import { queryField } from '@nexus/schema';

export const getSettingQuestionOption = queryField('getSettingQuestionOption', {
  type: 'QuestionOption',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let QuestionSetting,
        questionTypes = [],
        order = 0;

      QuestionSetting = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { QuestionOption: true },
      });

      if (!QuestionSetting) return [];

      for (const question of QuestionSetting.QuestionOption) {
        questionTypes.push({
          order,
          questionType: question,
        });

        order++;
      }

      return questionTypes ? questionTypes : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
