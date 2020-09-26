import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from "@nexus/schema";

export const updateEventManagement = mutationField("updateEventManagement", {
  type: "Boolean",
  args: {
    eventId: intArg({ required: true }),
    title: stringArg({ nullable: true }),
    startDate: arg({ type: "DateTime", nullable: true }),
    endDate: arg({ type: "DateTime", nullable: true }),
    url: stringArg({ nullable: true }),
    bannerImage: stringArg({ nullable: true }),
    isOnList: booleanArg({ nullable: true }),
    images: arg({ type: "ImageInputType", list: true, nullable: true }),
    contentsImages: arg({ type: "ImageInputType", list: true, nullable: true }),
    videos: arg({ type: "ImageInputType", list: true, nullable: true }),
    tags: arg({ type: "IdOrderInputType", nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        eventId,
        title,
        startDate,
        endDate,
        url,
        bannerImage,
        isOnList,
        images,
        contentsImages,
        videos,
        tags = [],
      } = args;
      let tagIdList: number[] = [],
        tagIdDicList: { id: number }[] = [],
        num = 0,
        eventResult,
        disconnectResult,
        connectResult,
        queryResult;
      eventResult = await ctx.prisma.event.findOne({
        where: { id: eventId },
        select: {
          tags: { select: { id: true } },
          images: { select: { id: true } },
          contentsImages: { select: { id: true } },
          videos: { select: { id: true } },
        },
      });
      if (!eventResult) return false;
      if (tags) {
        while (tagIdList.length < tags.length) {
          for (const eachTag of tags) {
            if (eachTag.order === num) {
              tagIdList.push(eachTag.id);
            }
          }
          num++;
        }
        for (const eachTagId of tagIdList) {
          tagIdDicList.push({ id: eachTagId });
        }
        disconnectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: { tags: { disconnect: eventResult.tags } },
        });
        connectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: {
            tags: { connect: tagIdDicList },
            onDetailTagId: { set: tagIdList },
          },
        });
        if (!disconnectResult || !connectResult) return false;
      }
      if (images) {
        disconnectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: { images: { delete: eventResult.images } },
        });
        connectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: {
            images: { create: images },
          },
        });
        if (!disconnectResult || !connectResult) return false;
      }
      if (contentsImages) {
        disconnectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: { images: { delete: eventResult.contentsImages } },
        });
        connectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: {
            contentsImages: { create: contentsImages },
          },
        });
        if (!disconnectResult || !connectResult) return false;
      }
      if (videos) {
        disconnectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: { images: { delete: eventResult.videos } },
        });
        connectResult = await ctx.prisma.event.update({
          where: { id: eventId },
          data: {
            videos: { create: videos },
          },
        });
        if (!disconnectResult || !connectResult) return false;
      }
      queryResult = await ctx.prisma.event.update({
        where: { id: eventId },
        data: {
          title,
          startDate,
          dueDate: endDate,
          url,
          bannerImage,
          isOnList,
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
