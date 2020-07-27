import { objectType } from "@nexus/schema";

export const Event = objectType({
  name: "Event",
  definition(t) {
    t.model.id();
    t.model.discription();
    t.model.images();
    t.model.videos();
    t.model.wishers();
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
  },
});
