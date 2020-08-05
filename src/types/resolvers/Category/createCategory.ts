import { mutationField, arg, intArg } from "@nexus/schema";

export const createCategory = mutationField("createCategory", {
  type: "Category",
  args: {
    name: arg({ type: "categoryNameInputType", list: true, required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { name } = args;
      let category;
      category = await ctx.prisma.category.create({
        data: { name: { create: name } },
      });
      return category;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
