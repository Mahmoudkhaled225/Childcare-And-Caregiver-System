import nodemailer from "nodemailer";

class EmailSender {
    constructor({ host = "localhost" /*stmp.gmail.com*/,
                    port = 587 /*465*/,
                    secure = false /*true  TLS*/,
                    service = "gmail",
                    auth}) {
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            service,
            auth,
        });
    }

    async sendEmail({ to, subject, message }) {
            const info = await this.transporter.sendMail({from: process.env.SENDER_EMAIL,
                to,
                subject,
                html: message,
            });
        if(info.accepted.length)
            return true;
        return false;
    }
};
export default EmailSender;
