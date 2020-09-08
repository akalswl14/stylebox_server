import { queryField, stringArg } from "@nexus/schema";
import nodemailer from "nodemailer";

export const sendEmail = queryField("sendEmail", {
  type: "Boolean",
  args: {
    option: stringArg({ required: true }),
    contents: stringArg({ required: true }),
    answerEmailAddress: stringArg({ required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { option, contents, answerEmailAddress } = args;
      let settingQueryResult, adminEmail, adminEmailPW;
      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { adminEmail: true, adminEmailPW: true },
      });
      adminEmail = settingQueryResult ? settingQueryResult.adminEmail : null;
      adminEmailPW = settingQueryResult
        ? settingQueryResult.adminEmailPW
        : null;
      if (!adminEmail || !adminEmailPW) {
        return false;
      }
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: adminEmail,
          pass: adminEmailPW,
        },
      });
      let info = await transporter.sendMail({
        from: `"StyleBox Question" <${adminEmail}>`, // sender address
        to: adminEmail, // list of receivers
        subject: "Question sended from Stylebox Question", // Subject line
        text: "", // plain text body
        html: `<p>Question type : <b>${option}</b></p><p>Question content : <b>${contents}</b></p><p>EMail to be answered : <b>${answerEmailAddress}</b>.</p>`, // html body
      });
      console.log("Message sent: %s", info.messageId);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
