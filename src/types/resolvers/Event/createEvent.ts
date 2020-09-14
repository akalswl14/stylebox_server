import { stringArg, mutationField, arg, booleanArg } from "@nexus/schema";

export const createEvent = mutationField("createEvent", {
  type: "Event",
  args: {
    images: arg({ type: "ImageInputType", list: true, required: true }),
    videos: arg({ type: "VideoInputType", list: true, required: true }),
    url: stringArg({ nullable: true }),
    dueDate: arg({ type: "DateTime", required: true }),
    bannerImage: stringArg({ required: true }),
    tags: arg({ type: "idDicInputType", list: true, nullable: true }),
    isOnList: booleanArg({ required: true }),
    title: stringArg({ required: true }),
    bannerText: stringArg({ nullable: true }),
    contentsImages: arg({ type: "ImageInputType", list: true, required: true }),
  },
  nullable: true,
  description:
    "images argument is for EventImage, videos argument is for EventVideo and contentsImages argument is for EventContentsImage.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        images,
        videos,
        url,
        dueDate,
        bannerImage,
        tags = [],
        isOnList,
        title,
        bannerText,
        contentsImages,
      } = args;
      let event;
      try {
        event = await ctx.prisma.event.create({
          data: {
            images: { create: images },
            videos: { create: videos },
            url,
            dueDate,
            bannerImage,
            tags: { connect: tags },
            isOnList,
            title,
            bannerText,
            contentsImages: { create: contentsImages },
            isExpired: false,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return event ? event : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
