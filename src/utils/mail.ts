import nodemailer from "nodemailer";

/**
 * Sends an email alert to the administrator with the IP address and count of failed requests.
 * @param {string} ip - The IP address of the user making the requests.
 * @param {number} count - The number of failed requests made by the user within the specified time window.
 */
export async function sendAlertEmail(ip: string, count: number) {
  const emailContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .email-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background-color:rgba(0, 123, 255, 0.79);
          color: #ffffff;
          padding: 15px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
          text-align: center;
          font-size: 16px;
          line-height: 1.5;
        }
        .email-body p {
          margin: 15px 0;
          color: #333;
        }
        .email-footer {
          background-color: #f1f1f1;
          padding: 10px;
          text-align: center;
          font-size: 14px;
          color: #555;
          border-radius: 0 0 8px 8px;
        }
        .cta-button {
          display: inline-block;
          background-color:#007BFF;
          color: #ffffff;
          text-color: #ffffff;
          padding: 10px 20px;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          margin-top: 20px;
        }
        .cta-button:hover {
          background-color:rgb(0, 123, 255);
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Alert: High Number of Failed Requests</h1>
        </div>
        <div class="email-body">
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Failed Requests Count:</strong> ${count}</p>
          <p>This alert was triggered due to the high number of failed requests from the above IP address within the specified time window.</p>
          <p>Please check your security settings and take necessary actions to resolve the issue.</p>
          <button href="#" class="cta-button">Review Logs</button>
        </div>
        <div class="email-footer">
          <p>This email was sent automatically. Please do not reply to it.</p>
          <p>&copy; 2025 Your Company</p>
        </div>
      </div>
    </body>
  </html>
`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      port: 587,
      tls: {
        rejectUnauthorized: false, // Ignore certificate errors (not recommended for production)
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "mattooecom@gmail.com",
      subject: "Alert: High Number of Failed Requests",
      html: emailContent,
    });

    console.log("Alert email sent successfully");
  } catch (error) {
    console.error("Failed to send alert email", error);
  }
}
