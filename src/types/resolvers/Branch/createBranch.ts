import { mutationField, arg, intArg, stringArg } from '@nexus/schema';

export const createBranch = mutationField('createBranch', {
  type: 'Branch',
  args: {
    shopId: intArg({ required: true }),
    names: arg({ type: 'NameInputType', list: true, required: true }),
    logoUrl: stringArg({ nullable: true }),
    phoneNumbers: stringArg({ nullable: true, list: true }),
    address: stringArg({ required: true }),
    googleMapUrl: stringArg({ nullable: true }),
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
      googleMapUrl,
      tags,
    } = args;
    let branchData, latitude, longitude;
    try {
      let url = googleMapUrl;
      let urlArray = url.split('@');
      let parsingArray = urlArray[1].split(',', 2);
      latitude = parseFloat(parsingArray[0]);
      longitude = parseFloat(parsingArray[1]);

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
          googleMapUrl,
          longitude,
          latitude,
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
