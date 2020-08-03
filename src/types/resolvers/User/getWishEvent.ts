import { queryField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getWishEvent = queryField("getWishEvent", {
  type: "Event",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      let user;
      try {
        user = await ctx.prisma.user.findOne({
          where: { id: userId },
          include: { wishEvents: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (user) {
        let events = user.wishEvents;
        return events;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
