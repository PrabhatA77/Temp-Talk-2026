import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({to,subject,html})=>{
    try {
        return await resend.emails.send({
            from:process.env.FROM_DOMAIN,
            to,
            subject,
            html
        })
    } catch (error) {
        console.error(error.message);
    }
}