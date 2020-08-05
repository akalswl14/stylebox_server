import { stringArg, mutationField, arg } from "@nexus/schema";

export const createEvent = mutationField("createEvent", {
  type: "Event",
  args: {
    images: arg({ type: "ImageInputType", list: true, required: true }),
    videos: arg({ type: "ImageInputType", list: true, required: true }),
    discription: stringArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { images, videos, discription = "" } = args;
      let event;
      try {
        event = await ctx.prisma.event.create({
          data: {
            discription,
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (event) {
        const eventId = event.id;
        images.forEach(async (eachImage: { url: string; order: any }) => {
          await ctx.prisma.eventImage.create({
            data: {
              url: eachImage.url,
              order: eachImage.order,
              Event: { connect: { id: eventId } },
            },
          });
        });
        videos.forEach(async (eachVideo: { url: string; order: any }) => {
          await ctx.prisma.eventVideo.create({
            data: {
              url: eachVideo.url,
              order: eachVideo.order,
              Event: { connect: { id: eventId } },
            },
          });
        });
        event = await ctx.prisma.event.findOne({
          where: { id: eventId },
        });
        return event;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
