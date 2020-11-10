import { intArg, queryField } from "@nexus/schema";

export const getPostVideo = queryField("getPostVideo", {
  type: "UrlOrder",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let videos = [];

      let videoResult = await ctx.prisma.post.findOne({
        where: { id },
        select: {
          videos: { select: { order: true, url: true } },
        },
      });

      if (!videoResult) return null;

      for (const video of videoResult.videos) {
        videos.push({
          order: video.order,
          url: video.url,
        });
      }

      videos.sort(function (a, b) {
        return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
      });

      return videos ? videos : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
