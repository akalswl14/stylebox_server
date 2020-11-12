import { queryField } from "@nexus/schema";
import { AnyAaaaRecord } from "dns";

export const getSettingAdminEmail = queryField("getSettingAdminEmail", {
  type: "AdminInfo",
  nullable: true,
  resolve: async (_, __, ctx) => {
    try {
      let AdminSetting;

      AdminSetting = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { adminEmail: true, adminEmailPW: true },
      });

      if (!AdminSetting) return null;

      let AdminInfo: any = {
        email: AdminSetting.adminEmail,
        pw: AdminSetting.adminEmailPW,
      };

      return AdminInfo ? AdminInfo : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
