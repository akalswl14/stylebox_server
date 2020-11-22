import { arg, intArg, mutationField, stringArg } from "@nexus/schema";
import { ShopVideo } from "@prisma/client";

export const createShop = mutationField("createShop", {
  type: "ShopIdInfo",
  args: {
    shopName: stringArg({ required: true }),
    logoUrl: stringArg({ nullable: true }),
    phoneNumber: stringArg({ required: true }),
    mainBranchAddress: stringArg({ required: true }),
    mainBranchMapUrl: stringArg({ required: true }),
    weight: intArg({ required: true }),
    tags: arg({ type: "IdOrderInputType", list: [true] }),
    FacebookLink: stringArg({ nullable: true }),
    InstagramLink: stringArg({ nullable: true }),
    YoutubeLink: stringArg({ nullable: true }),
    externalLinks: arg({ type: "LinkInputType", list: [true] }),
    shopImages: arg({ type: "ImageInputType", list: [true] }),
    shopVideos: arg({ type: "ImageInputType", list: [true] }),
    description: stringArg({ nullable: true }),
    branches: arg({ type: "branchInputType", list: [true] }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        shopName,
        logoUrl,
        phoneNumber,
        mainBranchAddress,
        mainBranchMapUrl,
        weight,
        FacebookLink,
        InstagramLink,
        YoutubeLink,
        description,
      } = args;
      let tags = args.tags ?? [];
      let externalLinks = args.externalLinks ?? [];
      let shopImages: { url: string; order: number }[] = args.shopImages ?? [];
      let shopVideos: { url: string; order: number }[] = args.shopVideos ?? [];
      let branches = args.branches ?? [];
      let branchList = [
        {
          names: { create: { lang: "VI", word: shopName } },
          phoneNumbers: { set: [phoneNumber] },
          address: mainBranchAddress,
          googleMapUrl: mainBranchMapUrl,
          isMain: true,
        },
      ];
      let rtnVideoList: {
        order: number;
        url: string;
        isYoutube: boolean;
      }[] = [];
      for (const eachBranch of branches) {
        branchList.push({
          names: { create: { lang: "VI", word: eachBranch.branchName } },
          phoneNumbers: { set: [eachBranch.branchPhoneNumber] },
          address: eachBranch.branchAddress,
          googleMapUrl: eachBranch.branchGoogleMapUrl,
          isMain: false,
        });
      }
      let linkList: {
        url: string;
        linkType:
          | "Facebook"
          | "FacebookMessanger"
          | "Instagram"
          | "LAZADA"
          | "OnlineShop"
          | "Sendo"
          | "Shopee"
          | "Tiki"
          | "TikTok"
          | "Youtube"
          | "Cafe24";
        order: number;
        onBottom: boolean;
        isShown: boolean;
      }[] = [];
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
          isShown: eachLink.isShown ? eachLink.isShown : true,
        });
      }
      for (var i = 0; i < shopVideos.length; i++) {
        rtnVideoList.push({ ...shopVideos[i], isYoutube: true });
      }
      let tagList: { id: number }[] = [],
        onDetailTagId: number[] = [];
      for (const eachTag of tags) {
        if (!eachTag.id) continue;
        tagList.push({ id: eachTag.id });
        onDetailTagId.push(eachTag.id);
      }
      let queryResult = await ctx.prisma.shop.create({
        data: {
          names: { create: { lang: "VI", word: shopName } },
          description,
          phoneNumber,
          monthlyRankNum: 0,
          monthlyRankScore: 0,
          priority: weight,
          onDetailTagId: { set: onDetailTagId },
          externalLinkClickNum: 0,
        },
        select: { id: true },
      });
      if (!queryResult) return null;
      let tagConnectResult = await ctx.prisma.shop.update({
        where: { id: queryResult.id },
        data: { tags: { connect: tagList } },
      });
      let classCreateResult = await ctx.prisma.class.create({
        data: {
          category: "ShopName",
          names: { create: { word: shopName, lang: "VI" } },
        },
        select: { id: true },
      });
      if (!classCreateResult) return null;
      let tagCreateResult = await ctx.prisma.tag.create({
        data: {
          Class: { connect: { id: classCreateResult.id } },
          shops: { connect: { id: queryResult.id } },
          names: { create: { word: shopName, lang: "VI" } },
          category: "ShopName",
          isClass: true,
          isRecommendation: 0,
        },
      });
      let branchResult;
      for (const eachBranch of branchList) {
        branchResult = await ctx.prisma.branch.create({
          data: {
            ...eachBranch,
            Shop: { connect: { id: queryResult.id } },
          },
        });
      }
      let linkResult;
      for (const eachLink of linkList) {
        linkResult = await ctx.prisma.shopExternalLink.create({
          data: {
            ...eachLink,
            Shop: { connect: { id: queryResult.id } },
          },
        });
      }
      let videoResult: ShopVideo | Boolean = true;
      for (const eachVideo of rtnVideoList) {
        videoResult = await ctx.prisma.shopVideo.create({
          data: { ...eachVideo, Shop: { connect: { id: queryResult.id } } },
        });
      }
      let CreateImages = shopImages.map((eachData) => ({
        order: eachData.order,
        url: "Shop/" + queryResult.id + "/" + eachData.url,
      }));
      let CreateImagesResult = await ctx.prisma.shop.update({
        where: { id: queryResult.id },
        data: {
          images: { create: CreateImages },
          logoUrl: logoUrl
            ? { set: "Shop/" + queryResult.id + "/" + logoUrl }
            : null,
        },
      });
      return queryResult &&
        tagConnectResult &&
        classCreateResult &&
        tagCreateResult &&
        branchResult &&
        linkResult &&
        videoResult &&
        CreateImagesResult
        ? { shopId: queryResult.id }
        : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
