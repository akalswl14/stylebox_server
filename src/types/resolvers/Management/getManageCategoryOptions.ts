import { queryField } from "@nexus/schema";

export const getManageCategoryOptions = queryField("getManageCategoryOptions", {
  type: "Category",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let rtnList: (
        | "ShopName"
        | "Feature"
        | "Location"
        | "Price"
        | "ProductClass"
        | "Style"
        | null
      )[] = [
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
