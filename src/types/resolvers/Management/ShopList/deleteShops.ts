import { intArg, mutationField } from "@nexus/schema";

export const deleteShops = mutationField("deleteShops", {
  type: "Boolean",
  args: {
    shopIds: intArg({ list: [true], required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { shopIds = [] } = args;
      let likeResult = await ctx.prisma.like.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let viewResult = await ctx.prisma.view.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let tagInfo = await ctx.prisma.tag.findMany({
        where: {
          shops: { some: { id: { in: shopIds } } },
          category: "ShopName",
        },
        select: { id: true, classId: true },
      });
      let branchList = await ctx.prisma.branch.findMany({
        where: { shopId: { in: shopIds } },
        select: { id: true },
      });
      let productList = await ctx.prisma.product.findMany({
        where: { branches: { some: { OR: branchList } } },
        select: { id: true },
      });
      let postList = await ctx.prisma.post.findMany({
        where: { shopId: { in: shopIds } },
        select: { id: true },
      });
      for (const eachPost of postList) {
        let postInfo = await ctx.prisma.post.findOne({
          where: { id: eachPost.id },
          select: {
            preferrers: { select: { id: true } },
            views: { select: { id: true } },
            products: { select: { id: true } },
            tags: { select: { id: true } },
            postExternalLinks: { select: { id: true } },
            images: { select: { id: true } },
            videos: { select: { id: true } },
          },
        });
        if (!postInfo) return false;
        let postUpdateResult = await ctx.prisma.post.update({
          where: { id: eachPost.id },
          data: {
            preferrers: { delete: postInfo.preferrers },
            views: { delete: postInfo.views },
            products: { disconnect: postInfo.products },
            tags: { disconnect: postInfo.tags },
            postExternalLinks: { delete: postInfo.postExternalLinks },
            images: { delete: postInfo.images },
            videos: { delete: postInfo.videos },
          },
        });
        let postResult = await ctx.prisma.post.delete({
          where: { id: eachPost.id },
        });
        if (!postUpdateResult && !postResult) return false;
      }
      for (const eachProduct of productList) {
        console.log("product : ", eachProduct.id);
        let productInfo = await ctx.prisma.product.findOne({
          where: { id: eachProduct.id },
          select: {
            tags: { select: { id: true } },
            names: { select: { id: true } },
            branches: { select: { id: true } },
            images: { select: { id: true } },
            videos: { select: { id: true } },
            preferrers: { select: { id: true } },
            views: { select: { id: true } },
            externalLink: { select: { id: true } },
          },
        });
        if (!productInfo) return false;
        let productUpdateResult = await ctx.prisma.product.update({
          where: { id: eachProduct.id },
          data: {
            tags: { disconnect: productInfo.tags },
            names: { delete: productInfo.names },
            branches: { disconnect: productInfo.branches },
            images: { delete: productInfo.images },
            videos: { delete: productInfo.videos },
            preferrers: { delete: productInfo.preferrers },
            views: { delete: productInfo.views },
          },
        });
        let productResult = await ctx.prisma.product.delete({
          where: { id: eachProduct.id },
        });
        let productLinkResult = await ctx.prisma.productExternalLink.delete({
          where: { id: productInfo.externalLink.id },
        });
        if (!productLinkResult && !productUpdateResult && !productResult) {
          return false;
        }
      }
      for (const eachBranch of branchList) {
        let branchUpdateResult = await ctx.prisma.branch.update({
          where: { id: eachBranch.id },
          data: {
            Shop: { disconnect: true },
            names: { deleteMany: { branchId: eachBranch.id } },
          },
        });
        let branchResult = await ctx.prisma.branch.delete({
          where: { id: eachBranch.id },
        });
        if (!branchUpdateResult && !branchResult) return false;
      }
      for (const eachTag of tagInfo) {
        if (eachTag.id && eachTag.classId) {
          let tagNameDeleteResult = await ctx.prisma.tagName.deleteMany({
            where: { tagId: eachTag.id },
          });
          let tagDeleteResult = await ctx.prisma.tag.delete({
            where: { id: eachTag.id },
          });
          let classNameResult = await ctx.prisma.className.deleteMany({
            where: { classId: eachTag.classId },
          });
          let classResult = await ctx.prisma.class.delete({
            where: { id: eachTag.classId },
          });
          if (
            !tagNameDeleteResult ||
            !tagDeleteResult ||
            !classNameResult ||
            !classResult
          )
            return false;
        }
      }
      let generalTags = await ctx.prisma.tag.findMany({
        where: {
          shops: { some: { id: { in: shopIds } } },
          category: { not: "ShopName" },
        },
        select: { id: true },
      });
      for (const eachShop of shopIds) {
        let tagDisconnectResult = await ctx.prisma.shop.update({
          where: { id: eachShop },
          data: { tags: { disconnect: generalTags } },
        });
        if (!tagDisconnectResult) return false;
      }
      let imageResult = await ctx.prisma.shopImage.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let videoResult = await ctx.prisma.shopVideo.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let linkResult = await ctx.prisma.shopExternalLink.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let nameResult = await ctx.prisma.shopName.deleteMany({
        where: { shopId: { in: shopIds } },
      });
      let queryResult = await ctx.prisma.shop.deleteMany({
        where: { id: { in: shopIds } },
      });
      return queryResult &&
        likeResult &&
        viewResult &&
        imageResult &&
        videoResult &&
        linkResult &&
        nameResult
        ? true
        : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
