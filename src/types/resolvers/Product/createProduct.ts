import {
  intArg,
  stringArg,
  mutationField,
  arg,
  booleanArg,
} from '@nexus/schema';

export const createProduct = mutationField('createProduct', {
  type: 'Product',
  args: {
    names: arg({ type: 'NameInputType', list: true, required: true }),
    images: arg({ type: 'ImageInputType', list: true, required: false }),
    branches: arg({ type: 'idDicInputType', list: true, required: false }),
    tags: arg({ type: 'idDicInputType', list: true, required: false }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
    price: intArg({ nullable: true }),
    externalLink: arg({ type: 'LinkInputType', required: false }),
    videos: arg({ type: 'VideoInputType', list: true, required: false }),
    isOwnPost: booleanArg({ required: false }),
    priority: intArg({ nullable: true }),
    mainPostId: intArg({ nullable: true }),
  },
  nullable: true,
  description:
    'names argument is for ProductName and images argument is for PostImage.',
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
        externalLink,
        videos = [],
        isOwnPost = false,
        priority = 0,
        mainPostId,
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
            externalLink: { create: externalLink },
            videos: { create: videos },
            isOwnPost,
            priority,
            mainPostId,
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
