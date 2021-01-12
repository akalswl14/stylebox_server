import { queryField, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getLikeOneStyle = queryField("getLikeOneStyle", {
  type: "Boolean",
  args: {
    postId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { postId } = args;
      const userId = Number(getUserId(ctx));
      if (!userId) return null;
      return null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
