import { mutationField } from "@nexus/schema";
import { sign } from "jsonwebtoken";
import { APP_SECRET, getUserId } from "../../../utils";

export const confirmUser = mutationField("confirmUser", {
  type: "AuthPayload",
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      let user;
      try {
        user = await ctx.prisma.user.findOne({ where: { id: userId } });
      } catch (e) {
        console.log(e);
      }
      if (user) {
        const token = sign({ userId: user.id }, APP_SECRET);
        return { user, token };
      } else {
        const newUser = await ctx.prisma.user.create({ data: {} });
        const token = sign({ userId: newUser.id }, APP_SECRET);
        return { user: newUser, token };
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
