import { Resend } from "resend";
import User from "../Models/userModel.js";

// Initialize the Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export const submitFeedback = async (req, res) => {
  try {
    const { category, message } = req.body;

    const fullUser = await User.findById(req.user._id);

    if (!fullUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    // req.user is attached by your verifyToken middleware
    const user = req.user; 

    if (!category || !message) {
      return res.status(400).json({ 
        success: false, 
        message: "Category and message are required." 
      });
    }

    // The beautiful HTML email template
    const feedbackHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">New Feedback Received 🚀</h2>
        <p><strong>From:</strong> ${fullUser.userName} (${fullUser.email})</p>
        <p><strong>Category:</strong> <span style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${category}</span></p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="white-space: pre-wrap; color: #555;">${message}</p>
      </div>
    `;

    const cleanDeveloperEmail = process.env.DEVELOPER_EMAIL.replace(/['";]+/g, '').trim();
    const cleanFromDomain = process.env.FROM_DOMAIN.replace(/['";]+/g, '').trim();

    const { data, error } = await resend.emails.send({
      from: `Relay App <${cleanFromDomain}>`,
      to: cleanDeveloperEmail,
      subject: `[Relay Feedback] ${category} from ${fullUser.userName}`, // 💡 FIX: fullUser here too
      html: feedbackHtml,
    });

    if (error) {
      console.error("Resend delivery failed:", error);
      return res.status(500).json({ 
        success: false, 
        message: "Feedback service is temporarily unavailable." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Feedback sent successfully. Thank you!" 
    });

  } catch (error) {
    console.error("Feedback route error:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to process feedback." 
    });
  }
};