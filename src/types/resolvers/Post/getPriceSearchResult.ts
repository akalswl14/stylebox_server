import { queryField, stringArg, intArg, arg } from "@nexus/schema";
import { getUserId } from "../../../utils";
import { S3_URL } from "../AWS_IAM";

export const getPriceSearchResult = queryField("getPriceSearchResult", {
  type: "searchResultList",
  args: {
    tags: arg({ type: "TagClassIdInputType", required: true, list: [true] }),
    filter: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  description: "About filter, 2 means Price Low and 3 means Price High",
  resolve: async (_, args, ctx) => {
    try {
      const { tags, filter = 1, cursorId } = args;
      const lang = args.lang ?? "VI";
      let queryResult,
        TagResult = [],
        PostResult = [],
        ClassResult,
        loadingPostNum,
        totalPostNum,
        rtnLastPostDate,
        tagIds = [],
        tagNumList = [],
        posts = [];
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, SearchPeriod: true },
      });
      if (!queryResult) return null;
      loadingPostNum = queryResult.loadingPostNum;
      let searchDate = queryResult?.SearchPeriod;
      searchDate.setUTCHours(0, 0, 0, 0);
      for (const eachTag of tags) {
        if (eachTag.isClass && eachTag.classId) {
          ClassResult = await ctx.prisma.class.findOne({
            where: { id: eachTag.classId },
            select: { tags: { select: { id: true } } },
          });
          if (ClassResult) {
            let tmpTags = ClassResult.tags;
            let tmpTagIds = [];
            for (const eachTag of tmpTags) {
              if (eachTag.id) {
                tagNumList.push(eachTag.id);
                tmpTagIds.push({ id: eachTag.id });
              }
            }
            tagIds.push({ tags: { some: { OR: tmpTagIds } } });
          }
        } else if (eachTag.tagId) {
          tagIds.push({ tags: { some: { id: eachTag.tagId } } });
          tagNumList.push(eachTag.tagId);
        }
      }
      let queryOption: {
        where: {
          AND: (
            | {
                tags: {
                  some: {
                    OR: {
                      id: number;
                    }[];
                    id?: undefined;
                  };
                };
              }
            | {
                tags: {
                  some: {
                    id: number;
                    OR?: undefined;
                  };
                };
              }
          )[];
          createdAt: {
            gte: Date;
          };
        };
        take: number;
        select: {
          id: boolean;
          shopId: boolean;
          mainProductPrice: boolean;
          mainProductId: boolean;
          images: {
            select: { url: boolean };
            take: number;
          };
          createdAt: boolean;
        };
        orderBy:
          | [{ isOnline: "asc" }, { mainProductPrice: "desc" }]
          | [{ isOnline: "desc" }, { mainProductPrice: "asc" }]
          | undefined;
        cursor: { id: number } | undefined;
        skip: number | undefined;
      } = {
        where: {
          AND: tagIds,
          createdAt: { gte: searchDate },
        },
        take: loadingPostNum,
        select: {
          id: true,
          shopId: true,
          mainProductPrice: true,
          mainProductId: true,
          images: { select: { url: true }, take: 1 },
          createdAt: true,
        },
        orderBy: undefined,
        cursor: cursorId ? { id: cursorId } : undefined,
        skip: cursorId ? 1 : undefined,
      };
      if (filter == 2) {
        queryOption.orderBy = [
          { isOnline: "asc" },
          { mainProductPrice: "desc" },
        ];
      } else {
        queryOption.orderBy = [
          { isOnline: "desc" },
          { mainProductPrice: "asc" },
        ];
      }
      PostResult = await ctx.prisma.post.findMany(queryOption);
      // console.log(PostResult);
      // return;
      totalPostNum = await ctx.prisma.post.count({
        where: {
          AND: tagIds,
          createdAt: { gte: searchDate },
        },
      });
      if (PostResult.length > 0) {
        rtnLastPostDate = PostResult[PostResult.length - 1].createdAt;
        queryResult = await ctx.prisma.tag.findMany({
          where: { id: { in: tagNumList } },
          select: { id: true, classId: true, category: true, isClass: true },
        });
        for (const eachTag of queryResult) {
          TagResult.push({
            tagId: eachTag.id,
            classId: eachTag.classId,
            category: eachTag.category,
            isClass: eachTag.isClass,
          });
        }
        for (const eachPost of PostResult) {
          let shopResult = await ctx.prisma.shopName.findMany({
            where: { shopId: eachPost.shopId, lang },
            select: { word: true },
          });
          let likeResult = await ctx.prisma.like.count({
            where: { userId, postId: eachPost.id },
          });
          let isLikePost = likeResult > 0 ? true : false;
          let productResult = await ctx.prisma.productName.findMany({
            where: { productId: eachPost.mainProductId, lang },
            select: { word: true },
          });
          if (!shopResult || !productResult) return null;
          let productName = productResult[0].word;
          posts.push({
            postId: eachPost.id,
            productName,
            shopName:
              shopResult.length > 0 && shopResult[0].word
                ? shopResult[0].word
                : null,
            postImage:
              eachPost.images &&
              eachPost.images.length > 0 &&
              eachPost.images[0].url
                ? S3_URL + eachPost.images[0].url
                : null,
            price: eachPost.mainProductPrice,
            isLikePost,
          });
        }
      }
      let rtn = {
        lastPostDate: PostResult.length > 0 ? rtnLastPostDate : null,
        totalPostNum,
        tags: TagResult,
        posts,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
