import {
  intArg,
  stringArg,
  mutationField,
  arg,
  booleanArg,
  floatArg,
} from "@nexus/schema";

export const createProduct = mutationField("createProduct", {
  type: "Product",
  args: {
    names: arg({ type: "NameInputType", list: true, required: true }),
    images: arg({ type: "ImageInputType", list: true, required: false }),
    branches: arg({ type: "idDicInputType", list: true, required: false }),
    tags: arg({ type: "idDicInputType", list: true, required: false }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
    price: intArg({ nullable: true }),
    externalLinks: arg({ type: "LinkInputType", list: true, required: false }),
    videos: arg({ type: "VideoInputType", list: true, required: false }),
    isOwnPost: booleanArg({ required: false }),
    priority: floatArg({ nullable: true }),
  },
  nullable: true,
  description:
    "names argument is for ProductName and images argument is for PostImage.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        names,
        images = [],
        branches = [],
        tags = [],
        description,
        instaText,
        price = 0,
        externalLinks = [],
        videos = [],
        isOwnPost = false,
        priority = 0.0,
      } = args;
      let product;
      try {
        product = await ctx.prisma.product.create({
          data: {
            names: { create: names },
            images: { create: images },
            branches: { connect: branches },
            tags: { connect: tags },
            description,
            instaText,
            price,
            externalLinks: { create: externalLinks },
            videos: { create: videos },
            isOwnPost,
            priority,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return product ? product : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
