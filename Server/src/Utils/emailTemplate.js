

export const welcomeEmail = (username) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to RELAY.</title>
        <style>
            /* Mobile Responsiveness */
            @media screen and (max-width: 600px) {
                .email-container { width: 100% !important; margin: auto !important; }
                .content-padding { padding: 20px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        
        <!-- Hidden Preheader Text (Good for deliverability and inbox previews) -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
            Welcome to RELAY, ${username}. Your minimal chat space is ready.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 2px solid #000000; border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header Section -->
                        <tr>
                            <td align="center" style="background-color: #000000; padding: 40px 20px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -1px;">RELAY.</h1>
                            </td>
                        </tr>
                        
                        <!-- Body Content Section -->
                        <tr>
                            <td class="content-padding" style="padding: 40px 40px 30px 40px; color: #111111;">
                                <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 22px; font-weight: 600;">Welcome, ${username}.</h2>
                                
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    We're thrilled to have you on board. <strong>RELAY</strong> is designed to keep your conversations seamless, minimal, and entirely in the moment.
                                </p>
                                
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    There is no clutter and no noise. Just you and the conversation. You can head back to the app whenever you are ready to start your first chat.
                                </p>

                                <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    Talk soon,<br>
                                    <strong>The RELAY team</strong>
                                </p>
                            </td>
                        </tr>

                        <!-- Secondary Content / Value Prop -->
                        <tr>
                            <td class="content-padding" style="padding: 0 40px 30px 40px; text-align: center;">
                                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 10px 0 30px 0;">
                                <h3 style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #888888;">Why RELAY?</h3>
                                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #555555;">
                                    Fast. Secure. Ephemeral. <br> Leave the digital footprint behind.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer Section (CRITICAL FOR AVOIDING SPAM) -->
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    &copy; 2026 RELAY Inc. All rights reserved.
                                </p>
                                
                                <!-- Physical Address: Required by anti-spam laws -->
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    123 Minimalist Ave, Suite 404, Tech City, TX 75001
                                </p>

                                <!-- Unsubscribe Link: Must be clear and easy to find -->
                                <p style="margin: 0; font-size: 12px; color: #999999;">
                                    You are receiving this email because you registered for RELAY. <br>
                                    If you did not make this request, you can <a href="https://your-temp-talk-link.com/unsubscribe" style="color: #000000; text-decoration: underline;">unsubscribe here</a>.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const verificationOtpEmail = (username, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your RELAY verification code</title>
        <style>
            /* Mobile Responsiveness */
            @media screen and (max-width: 600px) {
                .email-container { width: 100% !important; margin: auto !important; }
                .content-padding { padding: 20px !important; }
                .otp-box { font-size: 28px !important; letter-spacing: 4px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        
        <!-- Hidden Preheader Text (Critical for showing the OTP in the inbox preview) -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
            Your RELAY verification code is ${otp}.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 2px solid #000000; border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header Section -->
                        <tr>
                            <td align="center" style="background-color: #000000; padding: 30px 20px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px;">RELAY.</h1>
                            </td>
                        </tr>
                        
                        <!-- Body Content Section -->
                        <tr>
                            <td class="content-padding" style="padding: 40px 40px 30px 40px; color: #111111;">
                                <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600;">Verify your account</h2>
                                
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    Hi ${username},
                                </p>
                                
                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    Use the following one-time password (OTP) to securely complete your request. <strong>This code will expire in 10 minutes.</strong>
                                </p>

                                <!-- OTP Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <div class="otp-box" style="display: inline-block; background-color: #f4f4f4; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000000; border: 2px dashed #000000; border-radius: 4px;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                                    If you did not request this code, please ignore this email. Your account remains secure.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer Section -->
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    &copy; 2026 RELAY Inc. All rights reserved.
                                </p>
                                
                                <!-- Physical Address -->
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    123 Minimalist Ave, Suite 404, Tech City, TX 75001
                                </p>

                                <p style="margin: 0; font-size: 12px; color: #999999;">
                                    This is an automated security email. Please do not reply.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export const resetOtpEmail = (username, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RELAY password reset code</title>
        <style>
            @media screen and (max-width: 600px) {
                .email-container { width: 100% !important; margin: auto !important; }
                .content-padding { padding: 20px !important; }
                .otp-box { font-size: 28px !important; letter-spacing: 4px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        
        <!-- Hidden Preheader Text -->
        <div style="display: none; max-height: 0px; overflow: hidden;">
            Your RELAY password reset code is ${otp}.
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4; padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table border="0" cellpadding="0" cellspacing="0" class="email-container" style="max-width: 600px; width: 100%; background-color: #ffffff; border: 2px solid #000000; border-radius: 8px; overflow: hidden;">
                        
                        <!-- Header Section -->
                        <tr>
                            <td align="center" style="background-color: #000000; padding: 30px 20px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -1px;">RELAY.</h1>
                            </td>
                        </tr>
                        
                        <!-- Body Content Section -->
                        <tr>
                            <td class="content-padding" style="padding: 40px 40px 30px 40px; color: #111111;">
                                <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600;">Reset your password</h2>
                                
                                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    Hi ${username},
                                </p>
                                
                                <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                    We received a request to reset the password associated with your account. Enter the following code to choose a new password. <strong>This code will expire in 10 minutes.</strong>
                                </p>

                                <!-- OTP Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center">
                                            <div class="otp-box" style="display: inline-block; background-color: #f4f4f4; padding: 15px 30px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000000; border: 2px dashed #000000; border-radius: 4px;">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #666666;">
                                    <strong>Didn't request this?</strong> If you did not ask to reset your password, you can safely ignore this email. Your password will not be changed and your account remains secure.
                                </p>
                            </td>
                        </tr>

                        <!-- Footer Section -->
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 30px 20px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    &copy; 2026 RELAY Inc. All rights reserved.
                                </p>
                                
                                <!-- Physical Address -->
                                <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999;">
                                    123 Minimalist Ave, Suite 404, Tech City, TX 75001
                                </p>

                                <p style="margin: 0; font-size: 12px; color: #999999;">
                                    This is an automated security email. Please do not reply.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};