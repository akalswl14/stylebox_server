import {
  mutationField,
  arg,
  intArg,
  stringArg,
  booleanArg,
} from "@nexus/schema";
import AWS from "aws-sdk";
import { IAM_ID, IAM_SECRETKEY, BUCKET_NAME } from "../AWS_IAM";

export const createTag = mutationField("createTag", {
  type: "Tag",
  args: {
    classId: intArg({ required: true }),
    names: arg({ type: "NameInputType", list: true, required: true }),
    category: arg({ type: "Category", nullable: true }),
    tagImage: stringArg({ nullable: true }),
    isClass: booleanArg({ required: true }),
    isRecommendation: intArg({ required: true }),
  },
  nullable: true,
  description: "name argument is for TagName.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        names,
        classId,
        category,
        tagImage,
        isClass,
        isRecommendation,
      } = args;
      const s3 = new AWS.S3({
        accessKeyId: IAM_ID,
        secretAccessKey: IAM_SECRETKEY,
      });
      const params = {
        Bucket: BUCKET_NAME,
        CreateBucketConfiguration: {
          LocationConstraint: "ap-southeast-1",
        },
      };
      let tag;
      tag = await ctx.prisma.tag.create({
        data: {
          Class: { connect: { id: classId } },
          names: { create: names },
          category,
          tagImage,
          isClass,
          isRecommendation,
        },
      });
      return tag;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
