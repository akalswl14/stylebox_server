import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getEventDetail = queryField("getEventDetail", {
  type: "EventDetail",
  args: {
    eventId: intArg({ required: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      let { eventId, lang } = args;
      if (!lang) lang = "VI";
      let queryResult,
        order = 0,
        tagResult,
        eventVideos = [],
        eventImages = [],
        eventContentsImage = [],
        detailTags = [];

      await ctx.prisma.view.create({
        data: {
          Event: { connect: { id: eventId } },
          User: { connect: { id: userId } },
        },
      });

      try {
        queryResult = await ctx.prisma.event.findOne({
          where: {
            id: eventId,
          },
          select: {
            title: true,
            videos: { select: { id: true, url: true, order: true } },
            images: { select: { id: true, url: true, order: true } },
            url: true,
            dueDate: true,
            contentsImages: { select: { id: true, url: true, order: true } },
            onDetailTagId: true,
          },
        });
        if (!queryResult) {
          return null;
        }
        for (const eachVideo of queryResult.videos) {
          eventVideos.push({
            id: eachVideo.id,
            url: eachVideo.url,
            order: eachVideo.order,
          });
        }
        for (const eachImage of queryResult.images) {
          eventImages.push({
            id: eachImage.id,
            url: eachImage.url,
            order: eachImage.order,
          });
        }
        for (const eachContentsImage of queryResult.contentsImages) {
          eventContentsImage.push({
            id: eachContentsImage.id,
            url: eachContentsImage.url,
            order: eachContentsImage.order,
          });
        }
        for (const eachTag of queryResult.onDetailTagId) {
          tagResult = await ctx.prisma.tag.findOne({
            where: {
              id: eachTag,
            },
            select: {
              id: true,
              names: { where: { lang }, select: { word: true } },
            },
          });
          if (!tagResult) continue;
          detailTags.push({
            id: tagResult.id,
            order: order++,
            tagName: tagResult.names[0].word,
          });
        }
        let rtn: {
          eventTitle: string;
          eventVideos: { id: number; url: string; order: number }[];
          eventImages: { id: number; url: string; order: number }[];
          url: string | null;
          dueDate: Date;
          eventContentsImages: { id: number; url: string; order: number }[];
          detailTags: { id: number; tagName: string; order: number }[];
        } = {
          eventTitle: queryResult.title,
          url: queryResult.url,
          dueDate: queryResult.dueDate,
          eventVideos: eventVideos,
          eventImages: eventImages,
          eventContentsImages: eventContentsImage,
          detailTags: detailTags,
        };
        return rtn ? rtn : null;
      } catch (e) {
        console.log(e);
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
