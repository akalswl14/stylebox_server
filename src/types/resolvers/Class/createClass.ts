import { mutationField, arg } from "@nexus/schema";

export const createClass = mutationField("createClass", {
  type: "Class",
  args: {
    names: arg({ type: "NameInputType", list: true, required: true }),
    category: arg({ type: "Category", required: true }),
  },
  nullable: true,
  description: "name argument is for ClassName.",
  resolve: async (_, args, ctx) => {
    const { names, category } = args;
    let classData;
    try {
      classData = await ctx.prisma.class.create({
        data: { names: { create: names }, category },
      });
      return classData;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
