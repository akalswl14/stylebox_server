import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from "@nexus/schema";

export const updateShop = mutationField("updateShop", {
  type: "Boolean",
  args: {
    shopId: intArg({ required: true }),
    shopName: stringArg({ nullable: true }),
    isLogoUrlChange: booleanArg({ required: true }),
    logoUrl: stringArg({ nullable: true }),
    phoneNumber: stringArg({ nullable: true }),
    weight: intArg({ nullable: true }),
    isDescriptionChange: booleanArg({ required: true }),
    description: stringArg({ nullable: true }),
    tags: arg({ type: "IdOrderInputType", list: true }),
    externalLinks: arg({ type: "LinkInputType", list: true }),
    isFacebookLinkChage: booleanArg({ required: true }),
    FacebookLink: stringArg({ nullable: true }),
    isInstagramLinkChage: booleanArg({ required: true }),
    InstagramLink: stringArg({ nullable: true }),
    isYoutubeLinkChage: booleanArg({ required: true }),
    YoutubeLink: stringArg({ nullable: true }),
    shopImages: arg({ type: "ImageInputType", list: true }),
    shopVideos: arg({ type: "ImageInputType", list: true }),
    branches: arg({ type: "branchUpdateInputType", list: true }),
    mainBranchAddress: stringArg({ nullable: true }),
    mainBranchMapUrl: stringArg({ nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        shopId,
        shopName,
        isLogoUrlChange,
        logoUrl,
        phoneNumber,
        mainBranchAddress,
        mainBranchMapUrl,
        weight,
        tags,
        isFacebookLinkChage,
        isInstagramLinkChage,
        isYoutubeLinkChage,
        FacebookLink,
        InstagramLink,
        YoutubeLink,
        externalLinks,
        shopImages,
        shopVideos,
        isDescriptionChange,
        description,
        branches,
      } = args;
      let queryResult;
      if (shopName) {
        let nameResult = await ctx.prisma.shopName.findMany({
          where: { shopId },
          select: { id: true },
        });
        queryResult = await ctx.prisma.shopName.update({
          where: { id: nameResult[0].id },
          data: {
            word: shopName,
          },
        });
        if (!queryResult) return false;
        let tagResult = await ctx.prisma.tag.findMany({
          where: { category: "ShopName", shops: { some: { id: shopId } } },
          select: {
            names: { select: { id: true } },
          },
        });
        queryResult = await ctx.prisma.tagName.update({
          where: { id: tagResult[0].names[0].id },
          data: {
            word: shopName,
          },
        });
        if (!queryResult) return false;
        let branchResult = await ctx.prisma.branch.findMany({
          where: { shopId, isMain: true },
          select: { names: { select: { id: true } } },
        });
        queryResult = await ctx.prisma.branchName.update({
          where: { id: branchResult[0].names[0].id },
          data: {
            word: shopName,
          },
        });
        if (!queryResult) return false;
      }
      if (mainBranchAddress) {
        let branchResult = await ctx.prisma.branch.findMany({
          where: { shopId, isMain: true },
          select: { id: true },
        });
        queryResult = await ctx.prisma.branch.update({
          where: { id: branchResult[0].id },
          data: {
            address: mainBranchAddress,
          },
        });
        if (!queryResult) return false;
      }
      if (mainBranchMapUrl) {
        let branchResult = await ctx.prisma.branch.findMany({
          where: { shopId, isMain: true },
          select: { id: true },
        });
        queryResult = await ctx.prisma.branch.update({
          where: { id: branchResult[0].id },
          data: {
            googleMapUrl: mainBranchMapUrl,
          },
        });
        if (!queryResult) return false;
      }
      if (branches) {
        let originalBranches = await ctx.prisma.branch.findMany({
          where: { shopId, isMain: false },
          select: { id: true },
        });
        for (const eachOriginalBranch of originalBranches) {
          let isExist = false;
          for (var i = 0; i < branches.length; i++) {
            if (branches[i].id === eachOriginalBranch.id) {
              let inputBranch = branches[i];
              if (inputBranch.branchName) {
                queryResult = await ctx.prisma.branchName.updateMany({
                  where: { branchId: eachOriginalBranch.id },
                  data: {
                    word: inputBranch.branchName,
                  },
                });
                if (!queryResult) return false;
              }
              queryResult = await ctx.prisma.branch.update({
                where: { id: eachOriginalBranch.id },
                data: {
                  phoneNumbers: inputBranch.branchPhoneNumber
                    ? { set: [inputBranch.branchPhoneNumber] }
                    : null,
                  address: inputBranch.branchAddress
                    ? { set: inputBranch.branchAddress }
                    : null,
                  googleMapUrl: inputBranch.branchGoogleMapUrl,
                },
              });
              if (!queryResult) return false;
              branches.splice(i, 1);
              isExist = true;
            }
          }
          if (!isExist) {
            queryResult = await ctx.prisma.branch.delete({
              where: { id: eachOriginalBranch.id },
            });
            if (!queryResult) return false;
          }
        }
        for (const eachBranch of branches) {
          queryResult = await ctx.prisma.branch.create({
            data: {
              names: { create: { word: eachBranch.branchName, lang: "VI" } },
              address: eachBranch.branchAddress,
              isMain: false,
              Shop: { connect: { id: shopId } },
            },
          });
          if (!queryResult) return false;
        }
      }
      if (isFacebookLinkChage) {
        let isExist = await ctx.prisma.shopExternalLink.count({
          where: { shopId, onBottom: false, linkType: "Facebook" },
        });
        if (isExist > 0) {
          queryResult = await ctx.prisma.shopExternalLink.updateMany({
            where: { shopId, onBottom: false, linkType: "Facebook" },
            data: { url: FacebookLink },
          });
          if (!queryResult) return false;
        } else {
          let topLinks = await ctx.prisma.shopExternalLink.findMany({
            where: { shopId, onBottom: false },
            orderBy: { order: "asc" },
            select: { id: true, order: true },
          });
          queryResult = await ctx.prisma.shopExternalLink.create({
            data: {
              Shop: { connect: { id: shopId } },
              onBottom: false,
              linkType: "Facebook",
              url: FacebookLink,
              isShown: true,
              order: 0,
            },
          });
          if (!queryResult) return false;
          for (const eachLink of topLinks) {
            queryResult = await ctx.prisma.shopExternalLink.update({
              where: { id: eachLink.id },
              data: { order: eachLink.order + 1 },
            });
            if (!queryResult) return false;
          }
        }
      }
      if (isInstagramLinkChage) {
        let isExist = await ctx.prisma.shopExternalLink.count({
          where: { shopId, onBottom: false, linkType: "Instagram" },
        });
        if (isExist > 0) {
          queryResult = await ctx.prisma.shopExternalLink.updateMany({
            where: { shopId, onBottom: false, linkType: "Instagram" },
            data: { url: InstagramLink },
          });
          if (!queryResult) return false;
        } else {
          let facebookExist = await ctx.prisma.shopExternalLink.count({
            where: { shopId, onBottom: false, linkType: "Facebook" },
          });
          queryResult = await ctx.prisma.shopExternalLink.create({
            data: {
              Shop: { connect: { id: shopId } },
              onBottom: false,
              linkType: "Instagram",
              url: InstagramLink,
              isShown: true,
              order: facebookExist,
            },
          });
          if (!queryResult) return false;
          let youtubeExist = await ctx.prisma.shopExternalLink.findMany({
            where: { shopId, onBottom: true, linkType: "Youtube" },
          });
          for (const eachLink of youtubeExist) {
            queryResult = await ctx.prisma.shopExternalLink.update({
              where: { id: eachLink.id },
              data: { order: eachLink.order + 1 },
            });
            if (!queryResult) return false;
          }
        }
      }
      if (isYoutubeLinkChage) {
        let isExist = await ctx.prisma.shopExternalLink.count({
          where: { shopId, onBottom: false, linkType: "Youtube" },
        });
        if (isExist > 0) {
          queryResult = await ctx.prisma.shopExternalLink.updateMany({
            where: { shopId, onBottom: false, linkType: "Youtube" },
            data: { url: YoutubeLink },
          });
          if (!queryResult) return false;
        } else {
          let toplinkExist = await ctx.prisma.shopExternalLink.count({
            where: {
              shopId,
              onBottom: false,
              linkType: { in: ["Facebook", "Instagram"] },
            },
          });
          queryResult = await ctx.prisma.shopExternalLink.create({
            data: {
              Shop: { connect: { id: shopId } },
              onBottom: false,
              linkType: "Youtube",
              url: YoutubeLink,
              isShown: true,
              order: toplinkExist,
            },
          });
          if (!queryResult) return false;
        }
      }
      if (externalLinks) {
        queryResult = await ctx.prisma.shopExternalLink.deleteMany({
          where: { shopId, onBottom: true },
        });
        if (!queryResult) return false;
        for (const eachLink of externalLinks) {
          queryResult = await ctx.prisma.shopExternalLink.create({
            data: {
              onBottom: true,
              Shop: { connect: { id: shopId } },
              url: eachLink.url,
              linkType: eachLink.linkType,
              order: eachLink.order,
              isShown: eachLink.isShown ? eachLink.isShown : false,
            },
          });
          if (!queryResult) return false;
        }
      }
      if (shopImages) {
        queryResult = await ctx.prisma.shopImage.deleteMany({
          where: { shopId },
        });
        if (!queryResult) return false;
        for (const eachImage of shopImages) {
          queryResult = await ctx.prisma.shopImage.create({
            data: {
              Shop: { connect: { id: shopId } },
              url: eachImage.url,
              order: eachImage.order,
            },
          });
          if (!queryResult) return false;
        }
      }
      if (shopVideos) {
        queryResult = await ctx.prisma.shopVideo.deleteMany({
          where: { shopId },
        });
        if (!queryResult) return false;
        for (const eachVideo of shopVideos) {
          queryResult = await ctx.prisma.shopVideo.create({
            data: {
              Shop: { connect: { id: shopId } },
              url: eachVideo.url,
              order: eachVideo.order,
              isYoutube: true,
            },
          });
          if (!queryResult) return false;
        }
      }
      if (tags) {
        let tagIdList = [],
          tagIdDicList = [],
          cnt = 0;
        while (tagIdList.length < tags.length) {
          for (const eachTag of tags) {
            if (eachTag.order === cnt) {
              tagIdList.push(eachTag.id);
              tagIdDicList.push({ id: eachTag.id });
            }
          }
          cnt++;
        }
        for (const eachTag of tags) {
          tagIdList.push(eachTag.id);
        }
        let originalTags = await ctx.prisma.tag.findMany({
          where: { shops: { some: { id: shopId } } },
          select: { id: true },
        });
        queryResult = await ctx.prisma.shop.update({
          where: { id: shopId },
          data: {
            tags: { disconnect: originalTags },
          },
        });
        if (!queryResult) return false;
        queryResult = await ctx.prisma.shop.update({
          where: { id: shopId },
          data: {
            tags: { connect: tagIdDicList },
            onDetailTagId: { set: tagIdList },
          },
        });
        if (!queryResult) return false;
      }
      queryResult = await ctx.prisma.shop.update({
        where: { id: shopId },
        data: {
          logoUrl: isLogoUrlChange ? { set: logoUrl } : null,
          description: isDescriptionChange ? { set: description } : null,
          phoneNumber,
          priority: weight,
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
