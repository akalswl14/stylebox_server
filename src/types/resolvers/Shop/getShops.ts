import { intArg, queryField, stringArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getShops = queryField("getShops", {
  type: "ShopList",
  args: {
    lang: stringArg({ nullable: true }),
    locationId: intArg({ nullable: true }),
    tagId: intArg({ nullable: true }),
    classId: intArg({ nullable: true }),
    isClass: booleanArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { locationId, tagId, classId, isClass, cursorId } = args;
      const lang = args.lang ?? "VI";
      let shopResults,
        queryResult,
        loadingPostNum,
        totalShopNum = 0,
        shops = [],
        classTags: {
          id: number;
        }[] = [],
        tags = [];
      let countQueryOption:
        | {
            tags: {
              some: {
                AND: {
                  id: number;
                }[];
                OR: {
                  id: number;
                }[];
              };
            };
          }
        | {
            tags: {
              some: {
                AND: {
                  id: number;
                }[];
              };
            };
          }
        | {
            tags: {
              some: {
                OR: {
                  id: number;
                }[];
              };
            };
          }
        | undefined;
      let queryWhereOption:
        | {
            tags: {
              some: {
                AND: {
                  id: number;
                }[];
                OR: {
                  id: number;
                }[];
              };
            };
          }
        | {
            tags: {
              some: {
                AND: {
                  id: number;
                }[];
              };
            };
          }
        | {
            tags: {
              some: {
                OR: {
                  id: number;
                }[];
              };
            };
          }
        | undefined;
      try {
        const userId = Number(getUserId(ctx));
        if (!userId) return null;

        queryResult = await ctx.prisma.setting.findOne({
          where: {
            id: 1,
          },
          select: { loadingPostNum: true },
        });
        loadingPostNum = queryResult?.loadingPostNum
          ? queryResult?.loadingPostNum
          : 4;
        if (isClass) {
          if (classId) {
            classTags = await ctx.prisma.tag.findMany({
              where: {
                classId,
              },
              select: {
                id: true,
              },
            });
          }
        } else if (tagId) {
          tags.push({ id: tagId });
        }
        if (locationId) {
          tags.push({ id: locationId });
        }

        if (tags.length > 0) {
          if (classTags.length > 0) {
            queryWhereOption = {
              tags: { some: { AND: tags, OR: classTags } },
            };
            countQueryOption = {
              tags: { some: { AND: tags, OR: classTags } },
            };
          } else {
            queryWhereOption = { tags: { some: { AND: tags } } };
            countQueryOption = { tags: { some: { AND: tags } } };
          }
        } else {
          if (classTags.length > 0) {
            queryWhereOption = { tags: { some: { OR: classTags } } };
            countQueryOption = { tags: { some: { OR: classTags } } };
          }
        }
        let queryOption: {
          orderBy: {
            monthlyRankScore: "asc" | "desc";
          };
          take: number;
          select: {
            id: boolean;
            logoUrl: boolean;
            names: {
              select: {
                word: boolean;
              };
              where: {
                lang: string;
              };
            };
            onDetailTagId: boolean;
          };
          cursor: { id: number } | undefined;
          skip: number | undefined;
          where:
            | {
                tags: {
                  some: {
                    AND: {
                      id: number;
                    }[];
                    OR: {
                      id: number;
                    }[];
                  };
                };
              }
            | {
                tags: {
                  some: {
                    AND: {
                      id: number;
                    }[];
                  };
                };
              }
            | {
                tags: {
                  some: {
                    OR: {
                      id: number;
                    }[];
                  };
                };
              }
            | undefined;
        } = {
          orderBy: { monthlyRankScore: "desc" },
          take: loadingPostNum,
          select: {
            id: true,
            logoUrl: true,
            names: { select: { word: true }, where: { lang } },
            onDetailTagId: true,
          },
          where: queryWhereOption,
          cursor: cursorId ? { id: cursorId } : undefined,
          skip: cursorId ? 1 : undefined,
        };
        shopResults = await ctx.prisma.shop.findMany(queryOption);
        for (const eachShop of shopResults) {
          let isLikeShop,
            queryResult,
            tmp: {
              shopId: number;
              shopName: string;
              logoUrl: string | null;
              isLikeShop: boolean;
              tagNames: string[];
            } = {
              shopId: eachShop.id,
              shopName: eachShop.names[0].word,
              logoUrl: eachShop.logoUrl,
              isLikeShop: false,
              tagNames: [],
            };
          queryResult = await ctx.prisma.like.count({
            where: {
              userId,
              shopId: eachShop.id,
            },
          });
          isLikeShop = queryResult > 0 ? true : false;
          tmp.isLikeShop = isLikeShop;
          let order = 0;
          for (const eachId of eachShop.onDetailTagId) {
            if (order >= 3) break;
            queryResult = await ctx.prisma.tag.findOne({
              where: { id: eachId },
              select: {
                names: { where: { lang }, select: { word: true } },
              },
            });
            if (!queryResult) continue;
            if (queryResult) {
              tmp.tagNames.push(queryResult.names[0].word);
              order++;
            }
          }
          shops.push(tmp);
        }
        if (tags.length == 0 && classTags.length == 0) {
          totalShopNum = await ctx.prisma.shop.count({});
        } else {
          totalShopNum = await ctx.prisma.shop.count({
            where: countQueryOption,
          });
        }
      } catch (e) {
        console.log(e);
      }
      return {
        totalShopNum,
        shops,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
