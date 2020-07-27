import { objectType } from "@nexus/schema";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.string("token", { nullable: true });
    t.field("user", { type: "User", nullable: true });
  },
});
