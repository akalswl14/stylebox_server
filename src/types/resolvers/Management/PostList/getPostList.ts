import { booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getPostList = queryField("getPostList", {
  type: "PostManagementList",
  args: {
    pageNum: intArg({ nullable: true }),
    postId: intArg({ nullable: true }),
    mainProductName: stringArg({ nullable: true }),
    shopName: stringArg({ nullable: true }),
    postIdAsc: booleanArg({ nullable: true }),
    mainProductNameAsc: booleanArg({ nullable: true }),
    priceAsc: booleanArg({ nullable: true }),
    shopNameAsc: booleanArg({ nullable: true }),
    priorityAsc: booleanArg({ nullable: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        postId,
        mainProductName,
        shopName,
        postIdAsc,
        mainProductNameAsc,
        priceAsc,
        shopNameAsc,
        priorityAsc,
      } = args;

      const take = 13;
      const skip = (pageNum - 1) * take;
      let orderByOption,
        selectOption = {
          id: true,
          mainProductPrice: true,
          mainProductId: true,
          priority: true,
          monthlyRankNum: true,
          externalLinkClickNum: true,
          shopId: true,
        },
        postIdList = [],
        posts = [];

      if (mainProductName) {
        let productIdDicList = await ctx.prisma.product.findMany({
          where: {
            names: { some: { word: { contains: mainProductName } } },
          },
          select: { id: true },
        });
        let productIdList = [];
        for (const eachId of productIdDicList) {
          productIdList.push(eachId.id);
        }
        if (typeof mainProductNameAsc === "boolean") {
          let queryResult = await ctx.prisma.post.findMany({
            where: {
              mainProductId: { in: productIdList },
            },
            select: selectOption,
          });
          let mainProductIdList = [],
            totalPostList = [];
          for (const eachPost of queryResult) {
            mainProductIdList.push(eachPost.mainProductId);
          }
          let productNameResult = await ctx.prisma.productName.findMany({
            where: { productId: { in: mainProductIdList } },
            select: { productId: true },
            orderBy: { word: mainProductNameAsc ? "asc" : "desc" },
          });
          for (const eachProduct of productNameResult) {
            for (const eachPost of queryResult) {
              if (eachPost.mainProductId === eachProduct.productId) {
                totalPostList.push({
                  id: eachPost.id,
                  mainProductPrice: eachPost.mainProductPrice,
                  mainProductId: eachPost.mainProductId,
                  priority: eachPost.priority,
                  monthlyRankNum: eachPost.monthlyRankNum,
                  externalLinkClickNum: eachPost.externalLinkClickNum,
                  shopId: eachPost.shopId,
                });
              }
            }
          }
          if (totalPostList.length > skip) {
            for (var i = skip; i < skip + take; i++) {
              postIdList.push(totalPostList[i]);
              if (postIdList.length == take) break;
            }
          } else postIdList = [];
        } else if (typeof shopNameAsc === "boolean") {
          let totalPostList = [];
          let shopNameResult = await ctx.prisma.shopName.findMany({
            where: { shopId: { gte: 0 } },
            select: { shopId: true },
            orderBy: { word: shopNameAsc ? "asc" : "desc" },
          });
          for (const eachShop of shopNameResult) {
            let queryResult = await ctx.prisma.post.findMany({
              where: {
                shopId: eachShop.shopId,
                mainProductId: { in: productIdList },
              },
              select: selectOption,
              orderBy: { id: "asc" },
            });
            console.log(queryResult);
            if (queryResult) {
              totalPostList.push(...queryResult);
            }
          }
          if (totalPostList.length > skip) {
            for (var i = skip; i < skip + take; i++) {
              postIdList.push(totalPostList[i]);
              if (postIdList.length == take) break;
            }
          } else postIdList = [];
        } else {
          if (typeof postIdAsc === "boolean")
            orderByOption = { id: postIdAsc ? "asc" : "desc" };
          if (typeof priceAsc === "boolean") {
            orderByOption = { mainProductPrice: priceAsc ? "asc" : "desc" };
          }
          if (typeof priorityAsc === "boolean") {
            orderByOption = { priority: priorityAsc ? "asc" : "desc" };
          }
          postIdList = await ctx.prisma.post.findMany({
            where: {
              mainProductId: { in: productIdList },
            },
            take,
            skip,
            select: selectOption,
            orderBy: orderByOption,
          });
        }
      } else {
        if (typeof mainProductNameAsc === "boolean") {
          let totalPostList = [];
          let productNameResult = await ctx.prisma.productName.findMany({
            where: { productId: { gte: 0 } },
            select: { productId: true },
            orderBy: { word: mainProductNameAsc ? "asc" : "desc" },
          });
          for (const eachProduct of productNameResult) {
            let queryResult = await ctx.prisma.post.findMany({
              where: { mainProductId: eachProduct.productId },
              select: selectOption,
              orderBy: { id: "asc" },
            });
            totalPostList.push(...queryResult);
          }
          if (totalPostList.length > skip) {
            for (var i = skip; i < skip + take; i++) {
              postIdList.push(totalPostList[i]);
              if (postIdList.length == take) break;
            }
          } else postIdList = [];
        } else if (typeof shopNameAsc === "boolean") {
          let totalPostList = [];
          let shopNameResult = await ctx.prisma.shopName.findMany({
            where: { shopId: { gte: 0 } },
            select: { shopId: true },
            orderBy: { word: shopNameAsc ? "asc" : "desc" },
          });
          for (const eachShop of shopNameResult) {
            let queryResult = await ctx.prisma.post.findMany({
              where: { shopId: eachShop.shopId },
              select: selectOption,
              orderBy: { id: "asc" },
            });
            totalPostList.push(...queryResult);
          }
          if (totalPostList.length > skip) {
            for (var i = skip; i < skip + take; i++) {
              postIdList.push(totalPostList[i]);
              if (postIdList.length == take) break;
            }
          } else postIdList = [];
        } else {
          if (typeof postIdAsc === "boolean")
            orderByOption = { id: postIdAsc ? "asc" : "desc" };
          if (typeof priceAsc === "boolean") {
            orderByOption = { mainProductPrice: priceAsc ? "asc" : "desc" };
          }
          if (typeof priorityAsc === "boolean") {
            orderByOption = { priority: priorityAsc ? "asc" : "desc" };
          }
          postIdList = await ctx.prisma.post.findMany({
            where: {
              Shop: shopName
                ? { names: { some: { word: { contains: shopName } } } }
                : {},
              id: postId,
            },
            select: selectOption,
            orderBy: orderByOption,
            take,
            skip,
          });
        }
      }
      console.log(postIdList);
      for (const eachPost of postIdList) {
        let likesNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id },
        });
        let subProductsNum = await ctx.prisma.product.count({
          where: { posts: { some: { id: eachPost.id } } },
        });
        subProductsNum--;
        let viewsNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id },
        });
        let linksNum = await ctx.prisma.postExternalLink.count({
          where: { postId: eachPost.id },
        });
        let queryResult = await ctx.prisma.productName.findMany({
          where: { productId: eachPost.mainProductId },
          select: { word: true },
        });
        let rtnMainProductName = queryResult[0].word;
        queryResult = await ctx.prisma.shopName.findMany({
          where: { shopId: eachPost.shopId },
          select: { word: true },
        });
        let rtnShopName = queryResult[0].word;
        posts.push({
          postId: eachPost.id,
          mainProductName: rtnMainProductName,
          price: eachPost.mainProductPrice,
          shopName: rtnShopName,
          priority: eachPost.priority,
          likesNum,
          subProductsNum,
          viewsNum,
          linksClickNum: eachPost.externalLinkClickNum,
          linksNum,
          rank: eachPost.monthlyRankNum,
        });
      }
      return posts;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
