import { booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getProductList = queryField("getProductList", {
  type: "ProductListThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    productId: intArg({ nullable: true }),
    productName: stringArg({ nullable: true }),
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
        whereOption = { names: { some: { word: { contains: productName } } } };
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

          products.push({
            productId: productResult.id,
            productName: productResult.names[0].word,
            price: productResult.price,
            postNum,
            link: productResult.externalLink.url,
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

          products.push({
            productId: product.id,
            productName: product.names[0].word,
            price: product.price,
            postNum,
            link: product.externalLink.url,
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
