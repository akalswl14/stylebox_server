import { queryField } from "@nexus/schema";

export const getSettingQuestionOption = queryField("getSettingQuestionOption", {
  type: "QuestionOption",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let QuestionSetting,
        questionTypes = [],
        order = 1;

      QuestionSetting = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { QuestionOption: true },
      });

      if (!QuestionSetting) return null;

      for (const question of QuestionSetting.QuestionOption) {
        questionTypes.push({
          order,
          questionType: question,
        });

        order++;
      }

      return questionTypes;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
