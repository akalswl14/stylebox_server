import { intArg, stringArg, mutationField, arg } from "@nexus/schema";
import { create } from "domain";

export const createPost = mutationField("createPost", {
  type: "Post",
  args: {
    text: stringArg({ nullable: true }),
    title: stringArg({ nullable: true }),
    publisher: stringArg({ nullable: true }),
    products: intArg({ required: true, list: true }),
    images: arg({ type: "ImageInputType", list: true, required: true }),
    tags: intArg({ list: true, nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        text = "",
        title = "",
        publisher = "",
        images,
        products,
        tags = [],
      } = args;
      let post,
        tagList: { id: number }[] = [],
        productList: { id: number }[] = [];
      try {
        if (tags) {
          tags.forEach((eachTag: number) => {
            tagList.push({ id: eachTag });
          });
        }
        products.forEach((eachProduct) => {
          productList.push({ id: eachProduct });
        });
        post = await ctx.prisma.post.create({
          data: {
            text,
            title,
            publisher,
            products: { connect: productList },
            images: { create: images },
            tags: { connect: tagList },
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (post) {
        return post;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
