import { queryField } from "@nexus/schema";

export const getLinkTypeOption = queryField("getLinkTypeOption", {
  type: "LinkType",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let rtnList = [
        "Facebook",
        "Instagram",
        "FacebookMessanger",
        "Youtube",
        "TikTok",
        "Shopee",
        "Sendo",
        "LAZADA",
        "Tiki",
        "OnlineShop",
      ];
      return rtnList;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
