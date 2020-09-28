import { queryField } from "@nexus/schema";

export const getCategoryOptions = queryField("getCategoryOptions", {
  type: "Category",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let rtnList = [
        "Feature",
        "Location",
        "Price",
        "ProductClass",
        "ShopName",
        "Style",
      ];
      return rtnList;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
