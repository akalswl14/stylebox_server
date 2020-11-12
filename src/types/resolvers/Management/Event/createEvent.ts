import { arg, booleanArg, mutationField, stringArg } from "@nexus/schema";

export const createEvent = mutationField("createEvent", {
  type: "EventIdInfo",
  args: {
    title: stringArg({ required: true }),
    startDate: arg({ type: "DateTime", required: true }),
    endDate: arg({ type: "DateTime", required: true }),
    url: stringArg({ nullable: true }),
    bannerImage: stringArg({ required: true }),
    isOnList: booleanArg({ required: true }),
    images: arg({ type: "ImageInputType", list: true, required: true }),
    contentsImages: arg({ type: "ImageInputType", list: true, required: true }),
    videos: arg({ type: "ImageInputType", list: true, required: true }),
    tags: arg({ type: "IdOrderInputType", nullable: true, list: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        title,
        startDate,
        endDate,
        url,
        bannerImage,
        isOnList,
        images,
        contentsImages,
        videos,
      } = args;
      let tags: ({
        id?: number | null | undefined;
        order?: number | null | undefined;
      } | null)[] = args.tags ?? [];
      let tagIdList: number[] = [],
        tagIdDicList: { id: number }[] = [],
        num = 0;
      while (tagIdList.length < tags.length) {
        for (const eachTag of tags) {
          if (!eachTag || !eachTag.id || !eachTag.order) continue;
          if (eachTag.order === num) {
            tagIdList.push(eachTag.id);
          }
        }
        num++;
      }
      for (const eachTagId of tagIdList) {
        tagIdDicList.push({ id: eachTagId });
      }
      let videoList = [];
      for (const eachVideo of videos) {
        if (!eachVideo) continue;
        videoList.push({
          order: eachVideo.order,
          url: eachVideo.url,
          isYoutube: true,
        });
      }
      let queryResult = await ctx.prisma.event.create({
        data: {
          title,
          startDate,
          dueDate: endDate,
          url,
          bannerImage,
          videos: { create: videoList },
          onDetailTagId: { set: tagIdList },
          tags: { connect: tagIdDicList },
          isOnList,
        },
        select: { id: true },
      });
      if (!queryResult || !queryResult.id) return null;
      let rtnMainImages = [];
      for (const eachImage of images) {
        if (!eachImage) continue;
        rtnMainImages.push({
          order: eachImage.order,
          url: "Event/" + queryResult.id + "/" + eachImage.url,
        });
      }
      let rtnContentsImages = [];
      for (const eachImage of contentsImages) {
        if (!eachImage) continue;
        rtnContentsImages.push({
          order: eachImage.order,
          url: "Event/" + queryResult.id + "/" + eachImage.url,
        });
      }
      let ImageResult = await ctx.prisma.event.update({
        where: { id: queryResult.id },
        data: {
          bannerImage: "Event/" + queryResult.id + "/" + bannerImage,
          images: { create: rtnMainImages },
          contentsImages: { create: rtnContentsImages },
        },
      });
      return ImageResult ? { eventId: queryResult.id } : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
