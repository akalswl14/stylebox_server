import { objectType } from "@nexus/schema";

export const Event = objectType({
  name: "Event",
  definition(t) {
    t.model.id();
    t.model.discription();
    t.model.images();
    t.model.videos();
    t.model.wishers();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const EventImage = objectType({
  name: "EventImage",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.Event();
    t.model.eventId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const EventVideo = objectType({
  name: "EventVideo",
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.Event();
    t.model.eventId();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
