import { queryField } from "@nexus/schema";

export const getSettingAdminEmail = queryField("getSettingAdminEmail", {
  type: "AdminInfo",
  nullable: false,
  resolve: async (_, __, ctx) => {
    try {
      let AdminSetting;

      AdminSetting = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { adminEmail: true, adminEmailPW: true },
      });

      if (!AdminSetting) return null;

      let AdminInfo = {
        email: AdminSetting.adminEmail,
        pw: AdminSetting.adminEmailPW,
      };

      return AdminInfo;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
