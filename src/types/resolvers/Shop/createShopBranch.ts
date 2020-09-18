import { stringArg, mutationField, arg, intArg, floatArg } from '@nexus/schema';

export const createShopBranch = mutationField('createShopBranch', {
  type: 'ShopAndBranch',
  args: {
    names: arg({ type: 'NameInputType', nullable: true, list: true }),
    externalLinks: arg({
      type: 'ShopLinkInputType',
      list: true,
      required: false,
    }),
    logoUrl: stringArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    images: arg({ type: 'ImageInputType', nullable: true, list: true }),
    videos: arg({ type: 'VideoInputType', nullable: true, list: true }),
    phoneNumber: stringArg({ nullable: true, list: true }),
    tags: arg({ type: 'idDicInputType', list: true, nullable: true }),
    priority: intArg({ nullable: true }),
    onShopListTagId: intArg({ nullable: true, list: true }),
    onDetailTagId: intArg({ nullable: true, list: true }),
    gotoshopLink: stringArg({ nullable: true }),
    branchInfo: arg({ type: 'branchInputType', list: true, nullable: true }),
  },
  nullable: true,
  description:
    'names argument is for ShopName, images argument is for ShopImage and videos argument is for ShopVideo.',
  resolve: async (_, args, ctx) => {
    try {
      const {
        names = [],
        externalLinks = [],
        logoUrl,
        description,
        images = [],
        videos = [],
        phoneNumber = [],
        tags = [],
        priority = 0,
        onShopListTagId = [],
        onDetailTagId = [],
        gotoshopLink,
        branchInfo = [],
      } = args;
      let shop,
        branchData,
        latitude,
        longitude,
        branch = [],
        monthlyRankScore = 0.0;
      try {
        shop = await ctx.prisma.shop.create({
          data: {
            names: { create: names },
            externalLinks: { create: externalLinks },
            logoUrl,
            description,
            images: { create: images },
            videos: { create: videos },
            phoneNumber: { set: phoneNumber },
            tags: { connect: tags },
            priority,
            onShopListTagId: { set: onShopListTagId },
            onDetailTagId: { set: onDetailTagId },
            monthlyRankScore,
            gotoshopLink,
            externalLinkClickNum: 0,
          },
        });
        if (shop) {
          let classResult = await ctx.prisma.class.create({
            data: {
              category: 'ShopName',
              names: { create: names },
            },
          });

          await ctx.prisma.tag.create({
            data: {
              names: { create: names },
              isClass: true,
              category: 'ShopName',
              Class: { connect: { id: classResult.id } },
              shops: { connect: { id: shop.id } },
              isRecommendation: 0,
            },
          });

          for (const eachBranch of branchInfo) {
            let url = eachBranch.branchGoogleMapUrl;
            let urlArray = url.split('@');
            let parsingArray = urlArray[1].split(',', 2);
            latitude = parseFloat(parsingArray[0]);
            longitude = parseFloat(parsingArray[1]);

            branchData = await ctx.prisma.branch.create({
              data: {
                Shop: {
                  connect: {
                    id: shop.id,
                  },
                },
                names: { create: eachBranch.branchNames },
                phoneNumbers: { set: eachBranch.branchPhoneNumbers },
                address: eachBranch.branchAddress,
                googleMapUrl: eachBranch.branchGoogleMapUrl,
                longitude,
                latitude,
              },
            });

            branch.push(branchData);
          }
        }
      } catch (e) {
        console.log(e);
      }
      let rtn = {
        shop,
        branch,
      };
      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
