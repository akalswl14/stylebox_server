import { objectType } from "@nexus/schema";

export const Setting = objectType({
  name: "Setting",
  definition(t) {
    t.model.id();
    t.model.mainBubbleTagId();
    t.model.bestBubbleTagId();
    t.model.shopBubbleTagId();
    t.model.loadingPostNum();
    t.model.TodaysStylesPeriod();
    t.model.bestTotalPostNum();
    t.model.bestConstA();
    t.model.bestConstB();
    t.model.shopConstA();
    t.model.shopConstB();
    t.model.shopConstC();
    t.model.shopConstD();
    t.model.shopConstE();
    t.model.adminEmail();
    t.model.adminEmailPW();
    t.model.popularTagId();
    t.model.mainEventBannerId();
    t.model.QuestionOption();
    t.model.SearchPeriod();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
