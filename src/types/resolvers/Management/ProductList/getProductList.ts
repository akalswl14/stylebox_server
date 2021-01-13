import { booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getProductList = queryField("getProductList", {
  type: "ProductListThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    productId: intArg({ nullable: true }),
    productName: stringArg({ nullable: true }),
    shopName: stringArg({ nullable: true }),
    productIdAsc: booleanArg({ nullable: true }),
    productNameAsc: booleanArg({ nullable: true }),
    priceAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        productId,
        productName,
        shopName,
        productIdAsc,
        productNameAsc,
        priceAsc,
      } = args;

      let { pageNum } = args;
      if (!pageNum) pageNum = 1;

      let products = [],
        lang = "VI";
      let productResult;

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);

      let orderByOption = {},
        whereOption = {};

      if (productId) {
        whereOption = { id: productId };
      }
      if (productName) {
        whereOption = {
          names: {
            some: {
              searchWord: { contains: productName.toLowerCase() },
            },
          },
        };
      }
      if (shopName) {
        let prodIdByShop = [];
        let shopResult = await ctx.prisma.shopName.findMany({
          where: {
            searchWord: { contains: shopName.toLowerCase() },
          },
          select: { shopId: true },
        });
        if (!shopResult) return null;
        for (const eachShop of shopResult) {
          if (!eachShop.shopId) return null;
          let shopQueryResult = await ctx.prisma.shop.findOne({
            where: { id: eachShop.shopId },
            select: {
              branches: { select: { id: true } },
            },
          });
          if (!shopQueryResult) return null;
          for (const eachBranch of shopQueryResult.branches) {
            let branchQueryResult = await ctx.prisma.branch.findMany({
              where: {
                id: eachBranch.id,
              },
              select: {
                products: {
                  select: {
                    id: true,
                  },
                },
              },
            });
            if (!branchQueryResult) return null;
            for (const branch of branchQueryResult) {
              for (const eachProduct of branch.products) {
                prodIdByShop.push(eachProduct.id);
              }
            }
          }
        }
        const productIdByShop = Array.from(new Set(prodIdByShop));
        whereOption = {
          id: { in: productIdByShop },
        };
      }
      if (typeof productIdAsc === "boolean") {
        orderByOption = productIdAsc ? { id: "asc" } : { id: "desc" };
      } else if (typeof priceAsc === "boolean") {
        orderByOption = priceAsc ? { price: "asc" } : { price: "desc" };
      } else {
        orderByOption = [{ id: "asc" }, { price: "asc" }];
      }

      if (typeof productNameAsc === "boolean") {
        let whereOptionProductResult = await ctx.prisma.product.findMany({
          where: whereOption,
          select: {
            id: true,
          },
        });

        let productIdList = [];

        for (const eachProduct of whereOptionProductResult) {
          productIdList.push(eachProduct.id);
        }

        let productNameAscResult = await ctx.prisma.productName.findMany({
          where: { productId: { in: productIdList }, lang: "VI" },
          skip: skipNum,
          take: loadingNum,
          orderBy: productNameAsc ? { word: "asc" } : { word: "desc" },
          select: { productId: true },
        });

        if (!productNameAscResult) return null;

        let productAscList = [];

        for (const eachProduct of productNameAscResult) {
          if (eachProduct.productId) productAscList.push(eachProduct.productId);
        }

        for (const id of productAscList) {
          productResult = await ctx.prisma.product.findOne({
            where: { id: id },
            select: {
              id: true,
              names: {
                where: { lang },
                select: { word: true },
              },
              price: true,
              externalLink: { select: { url: true } },
            },
          });

          if (!productResult) return null;

          let postNum = await ctx.prisma.post.count({
            where: { products: { some: { id: productResult.id } } },
          });

          let branchQuery = await ctx.prisma.product.findOne({
            where: { id: productResult.id },
            select: {
              branches: {
                select: {
                  shopId: true,
                },
              },
            },
          });
          if (!branchQuery) return null;
          if (!branchQuery.branches[0].shopId) return null;

          let shopQuery = await ctx.prisma.shop.findOne({
            where: { id: branchQuery.branches[0].shopId },
            select: {
              names: {
                where: { lang },
                select: { word: true },
              },
            },
          });

          products.push({
            productId: productResult.id,
            productName: productResult.names[0].word,
            shopName: shopQuery ? shopQuery.names[0].word : "",
            price: productResult.price,
            postNum,
            link: productResult.externalLink
              ? productResult.externalLink.url
              : "",
          });
        }
      } else {
        productResult = await ctx.prisma.product.findMany({
          where: whereOption,
          orderBy: orderByOption,
          skip: skipNum,
          take: loadingNum,
          select: {
            id: true,
            names: {
              where: { lang },
              select: { word: true },
            },
            price: true,
            externalLink: { select: { url: true } },
          },
        });

        for (const product of productResult) {
          let postNum = await ctx.prisma.post.count({
            where: { products: { some: { id: product.id } } },
          });

          let branchQuery = await ctx.prisma.product.findOne({
            where: { id: product.id },
            select: {
              branches: {
                select: {
                  shopId: true,
                },
              },
            },
          });
          if (!branchQuery) return null;
          if (!branchQuery.branches[0].shopId) return null;

          let shopQuery = await ctx.prisma.shop.findOne({
            where: { id: branchQuery.branches[0].shopId },
            select: {
              names: {
                where: { lang },
                select: { word: true },
              },
            },
          });

          products.push({
            productId: product.id,
            productName: product.names[0].word,
            shopName: shopQuery ? shopQuery.names[0].word : "",
            price: product.price,
            postNum,
            link: product.externalLink ? product.externalLink.url : "",
          });
        }
      }

      let totalProductNum = await ctx.prisma.product.count({
        where: whereOption,
      });

      return {
        products,
        totalProductNum,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
