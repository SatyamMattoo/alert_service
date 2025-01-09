import nodemailer from "nodemailer";

export async function sendAlertEmail(ip: string, count: number) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "admin@example.com",
    subject: "Alert: High Number of Failed Requests",
    text: `IP ${ip} has made ${count} failed requests within the time window.`,
  });
}