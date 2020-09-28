import { arg, intArg, mutationField, stringArg } from "@nexus/schema";

export const createShop = mutationField("createShop", {
  type: "Boolean",
  args: {
    shopName: stringArg({ required: true }),
    logoUrl: stringArg({ nullable: true }),
    phoneNumber: stringArg({ required: true }),
    mainBranchAddress: stringArg({ required: true }),
    mainBranchMapUrl: stringArg({ required: true }),
    weight: intArg({ required: true }),
    tags: arg({ type: "IdOrderInputType", list: true }),
    FacebookLink: stringArg({ nullable: true }),
    InstagramLink: stringArg({ nullable: true }),
    YoutubeLink: stringArg({ nullable: true }),
    externalLinks: arg({ type: "LinkInputType" }),
    shopImages: arg({ type: "ImageInputType", list: true }),
    shopVideos: arg({ type: "ImageInputType", list: true }),
    description: stringArg({ nullable: true }),
    branches: arg({ type: "branchInputType", list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        shopName,
        logoUrl,
        phoneNumber,
        mainBranchAddress,
        mainBranchMapUrl,
        weight,
        tags = [],
        FacebookLink,
        InstagramLink,
        YoutubeLink,
        externalLinks = [],
        shopImages = [],
        shopVideos = [],
        description,
        branches = [],
      } = args;
      let branchList = [
        {
          names: { create: { lang: "VI", word: shopName } },
          phoneNumbers: { set: [phoneNumber] },
          address: mainBranchAddress,
          googleMapUrl: mainBranchMapUrl,
          isMain: true,
        },
      ];
      for (const eachBranch of branches) {
        branchList.push({
          names: { create: { lang: "VI", word: eachBranch.branchName } },
          phoneNumbers: { set: [eachBranch.branchPhoneNumber] },
          address: eachBranch.branchAddress,
          googleMapUrl: eachBranch.branchGoogleMapUrl,
          isMain: false,
        });
      }
      let linkList = [];
      let order = 0;
      if (FacebookLink) {
        linkList.push({
          url: FacebookLink,
          linkType: "Facebook",
          order,
          onBottom: false,
          isShown: true,
        });
        order++;
      }
      if (InstagramLink) {
        linkList.push({
          url: InstagramLink,
          linkType: "Instagram",
          order,
          onBottom: false,
          isShown: true,
        });
        order++;
      }
      if (YoutubeLink) {
        linkList.push({
          url: YoutubeLink,
          linkType: "Youtube",
          order,
          onBottom: false,
          isShown: true,
        });
        order++;
      }
      order = 0;
      for (const eachLink of externalLinks) {
        linkList.push({
          url: eachLink.url,
          linkType: eachLink.linkType,
          order: eachLink.order,
          onBottom: true,
          isShown: eachLink.isShown,
        });
      }
      for (var i = 0; i < shopVideos.length; i++) {
        shopVideos[i].isYoutube = true;
      }
      let tagList = [],
        onDetailTagId = [],
        cnt = 0;
      while (onDetailTagId.length < tags.length) {
        for (const eachTag of tags) {
          if (cnt === eachTag.order) {
            tagList.push({ id: eachTag.id });
            onDetailTagId.push(eachTag.id);
            cnt++;
          }
        }
      }
      let queryResult = await ctx.prisma.shop.create({
        data: {
          names: { create: { lang: "VI", word: shopName } },
          branches: {
            create: branchList,
          },
          externalLinks: {
            create: linkList,
          },
          logoUrl,
          description,
          images: { create: shopImages },
          videos: { create: shopVideos },
          phoneNumber,
          tags: { connect: tagList },
          monthlyRankNum: 0,
          monthlyRankScore: 0,
          priority: weight,
          onDetailTagId: { set: onDetailTagId },
          externalLinkClickNum: 0,
        },
        select: { id: true },
      });
      let classResult = await ctx.prisma.class.create({
        data: {
          names: { create: { lang: "VI", word: shopName } },
          category: "ShopName",
          tags: {
            create: {
              category: "ShopName",
              shops: { connect: { id: queryResult.id } },
              names: { create: { lang: "VI", word: shopName } },
              isClass: true,
              isRecommendation: 0,
            },
          },
        },
      });
      return queryResult && classResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
