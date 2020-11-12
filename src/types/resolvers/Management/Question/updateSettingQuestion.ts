import { arg, mutationField, stringArg } from "@nexus/schema";

export const updateSettingQuestion = mutationField("updateSettingQuestion", {
  type: "Boolean",
  args: {
    email: stringArg({ nullable: true }),
    pw: stringArg({ nullable: true }),
    questionTypes: arg({
      type: "QuestionInputType",
      nullable: true,
      list: true,
    }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { questionTypes = [], email, pw } = args;
      let updateQuery;

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

      if (questionTypes) {
        let QuestionType: { order: number; questionType: string }[] = [];

        for (const eachItem of questionTypes) {
          if (eachItem) {
            if (eachItem.order && eachItem.questionType)
              QuestionType.push({
                order: eachItem.order,
                questionType: eachItem.questionType,
              });
          }
        }

        if (questionTypes.length > 0) {
          QuestionType.sort((a, b) =>
            a.order < b.order ? -1 : a.order > b.order ? 1 : 0
          );
          let questionOptions = [];
          for (const type of QuestionType) {
            questionOptions.push(type.questionType);
          }
          updateQuery = await ctx.prisma.setting.update({
            where: { id: 1 },
            data: { QuestionOption: { set: questionOptions } },
          });
        }
      }

      if (!updateQuery) return false;

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
