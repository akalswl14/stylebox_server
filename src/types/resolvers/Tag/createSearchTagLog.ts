import { mutationField, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const createSearchTagLog = mutationField("createSearchTagLog", {
  type: "Boolean",
  args: {
    tagId: intArg({ required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagId } = args;
      let queryResult;
      const userId = Number(getUserId(ctx));
      queryResult = await ctx.prisma.searchTagLog.create({
        data: {
          User: { connect: { id: userId } },
          Tag: { connect: { id: tagId } },
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
