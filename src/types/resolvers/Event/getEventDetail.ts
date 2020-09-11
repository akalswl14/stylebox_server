import { queryField, stringArg, intArg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getEventDetail = queryField('getEventDetail', {
  type: 'EventDetail',
  args: {
    eventId: intArg({ required: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      const { eventId, lang = 'ENG' } = args;
      let queryResult,
        eventVideos = [],
        eventImages = [],
        eventContentsImage = [],
        locationTags = [],
        rtn: {
          eventTitle: string;
          eventVideos: { id: number; url: string; order: number }[];
          eventImages: { id: number; url: string; order: number }[];
          url: string | null;
          dueDate: Date;
          eventContentsImages: { id: number; url: string; order: number }[];
          locationTags: { id: number; tagName: string }[];
        } = {};

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
            tags: {
              where: { category: 'Location' },
              select: {
                id: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
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
        for (const eachTag of queryResult.tags) {
          locationTags.push({
            id: eachTag.id,
            tagName: eachTag.names[0].word,
          });
        }
        rtn.eventTitle = queryResult.title;
        rtn.url = queryResult.url;
        rtn.dueDate = queryResult.dueDate;
        rtn.eventVideos = eventVideos;
        rtn.eventImages = eventImages;
        rtn.eventContentsImages = eventContentsImage;
        rtn.locationTags = locationTags;
      } catch (e) {
        console.log(e);
      }
      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
