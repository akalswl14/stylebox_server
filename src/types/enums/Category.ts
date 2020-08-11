import { enumType } from "@nexus/schema";

export const Category = enumType({
  name: "Category",
  members: ["Location", "ProductClass", "Style", "Price"],
});
