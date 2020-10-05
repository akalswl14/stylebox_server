import { arg, booleanArg, mutationField, stringArg } from "@nexus/schema";

export const createEvent = mutationField("createEvent", {
  type: "Boolean",
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
  nullable: false,
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
        tags = [],
      } = args;
      let tagIdList: number[] = [],
        tagIdDicList: { id: number }[] = [],
        num = 0;
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
      let videoList = [];
      for (const eachVideo of videos) {
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
          images: { create: images },
          contentsImages: { create: contentsImages },
          videos: { create: videoList },
          onDetailTagId: { set: tagIdList },
          tags: { connect: tagIdDicList },
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
