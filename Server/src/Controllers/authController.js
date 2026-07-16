import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  verificationOtpEmail,
  welcomeEmail,
  resetOtpEmail,
} from "../Utils/emailTemplate.js";
import { sendEmail } from "../services/emailService.js";
import { generateOtp } from "../Utils/generateOtp.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: "Email already registered",
        });
      }

      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user
    const user = await User.create({
      userName: userName,
      email: email,
      password: hashedPassword,
    });

    const otp = generateOtp();

    user.verificationOtp = otp;
    user.verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000;
    user.verificationOtpSentAt = new Date();

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: verificationOtpEmail(user.userName, otp),
      });
    } catch (err) {
      console.error(err);

      return res.status(500).json({
        success: false,
        message:
          "Registration completed but we couldn't send the verification email. Please use Resend OTP.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerificationOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    const cooldown = 60 * 1000;

    if (
      user.verificationOtpSentAt &&
      Date.now() - user.verificationOtpSentAt.getTime() < cooldown
    ) {
      const secondsLeft = Math.ceil(
        (cooldown - (Date.now() - user.verificationOtpSentAt.getTime())) / 1000,
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft} seconds before requesting another OTP.`,
      });
    }

    const otp = generateOtp();

    user.verificationOtp = otp;
    user.verificationOtpExpiresAt = Date.now() + 10 * 60 * 1000;
    user.verificationOtpSentAt = new Date();

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verification OTP",
      html: verificationOtpEmail(user.userName, otp),
    });

    return res.status(200).json({
      success: true,
      message: "Verification OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, verificationOtp } = req.body;

  try {
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    if (Date.now() > user.verificationOtpExpiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }
    if (user.verificationOtp !== verificationOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.verificationOtp = "";
    user.verificationOtpExpiresAt = null;
    user.verificationOtpSentAt = null;

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Relay!",
        html: welcomeEmail(user.userName),
      });
    } catch (err) {
      console.error(err);
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { userName: identifier }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.authProvider === "google" && !user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    //check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //create jwt token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    });

    return res.json({
      success: true,
      message: "Login Successfull",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
        avatarUrl: user.avatarUrl || "", 
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    // verifies the token's signature against Google's servers — this is what
    // makes it trustworthy, not just decoding the JWT payload blindly
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google account has no email" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // new account — auto-verified since Google already confirmed the email,
      // no password since they'll always sign in via Google
      user = await User.create({
        userName: name || email.split("@")[0],
        email,
        isVerified: true,
        avatarUrl: picture || "",
        authProvider: "google",
      });
    } else if (user.authProvider !== "google" && !user.avatarUrl && picture) {
      // existing local account signing in with Google for the first time —
      // pick up their Google photo if they don't already have one, but don't
      // touch their password or force-convert the account type
      user.avatarUrl = picture;
      await user.save();
    }

    // reuse the exact same JWT + cookie logic as normal login
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google Sign-In successful",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        isVerified: user.isVerified,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (error) {
    console.error("googleLogin error:", error.message);
    return res.status(401).json({ success: false, message: "Google authentication failed" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect credentials",
      });
    }

    const otp = generateOtp();

    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset OTP",
      html: resetOtpEmail(user.userName, otp),
    });

    return res.status(200).json({
      success: true,
      message: "Reset OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "Email and OTP are required.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  if (!user.resetOtp) {
    return res.status(400).json({
      message: "No reset OTP found. Please request a new one.",
    });
  }

  if (user.resetOtpExpiresAt < Date.now()) {
    return res.status(400).json({
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (user.resetOtp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP.",
    });
  }

  user.resetOtpVerified = true;
  await user.save();

  return res.status(200).json({
    success:true,
    message: "OTP verified successfully.",
  });
};

export const sendResetPasswordOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required.",
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  // Generate new OTP
  const otp = generateOtp();

  user.resetOtp = otp;
user.resetOtpExpiresAt = Date.now() + 10 * 60 * 1000;

  await user.save();

  console.log("Sending reset OTP email...");

try {
      await sendEmail({
        to: user.email,
        subject: "RESET OTP",
        html: resetOtpEmail(user.userName,otp),
      });
    } catch (err) {
      console.error(err);
    }

console.log("Reset OTP email sent.");

  return res.status(200).json({
    message: "OTP sent successfully.",
  });
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.resetOtpVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify the OTP first.",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    // Clear reset data
    user.resetOtp = "";
    user.resetOtpExpiresAt = null;
    user.resetOtpVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.json({
    user,
    message: "user profile fetched successfully",
  });
};
