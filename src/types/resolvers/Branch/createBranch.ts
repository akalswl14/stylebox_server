import { mutationField, arg, intArg, stringArg } from '@nexus/schema';

export const createBranch = mutationField('createBranch', {
  type: 'Branch',
  args: {
    shopId: intArg({ required: true }),
    names: arg({ type: 'NameInputType', list: true, required: true }),
    logoUrl: stringArg({ nullable: true }),
    phoneNumbers: stringArg({ nullable: true, list: true }),
    address: stringArg({ required: true }),
    googleMapId: intArg({ nullable: true }),
    tags: arg({ type: 'idDicInputType', list: true, nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    const {
      shopId,
      names,
      logoUrl,
      phoneNumbers = [],
      address,
      googleMapId,
      tags,
    } = args;
    let branchData;
    try {
      branchData = await ctx.prisma.branch.create({
        data: {
          Shop: {
            connect: {
              id: shopId,
            },
          },
          names: { create: names },
          logoUrl,
          phoneNumbers: { set: phoneNumbers },
          address,
          googleMapId,
          tags: { connect: tags },
        },
      });
      return branchData;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
