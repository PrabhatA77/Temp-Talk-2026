import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LegalInfo = () => {
  const navigate = useNavigate();

  const lastUpdated = "July 15, 2026";

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-10 gap-10">
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-black text-6xl font-bold dark:text-white m-2">RELAY</div>
        <div className="text-[13px] text-gray-400 dark:text-gray-500 tracking-widest">
          ---------------- SIMPLE . MINIMAL . TERMINAL ----------------
        </div>
      </div>

      <div className="w-full max-w-3xl border dark:border-white rounded backdrop-blur-sm bg-white/1 dark:bg-black/1 p-8 flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-zinc-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-extrabold text-2xl dark:text-white">PRIVACY POLICY</h1>
          <div className="w-9" />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">Last updated: {lastUpdated}</p>

        <div className="flex flex-col gap-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <Section title="1. Information We Collect">
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li><strong className="text-black dark:text-white">Account data:</strong> username, email address, and a hashed password (if you sign up directly), or your name, email, and profile photo (if you sign in with Google).</li>
              <li><strong className="text-black dark:text-white">Profile data:</strong> a profile photo, if you upload one.</li>
              <li><strong className="text-black dark:text-white">Content:</strong> messages, images, and files you send in temporary or persistent rooms.</li>
              <li><strong className="text-black dark:text-white">Usage data:</strong> room membership, admin roles, online/offline status, and typing activity, used only to power live features while you're using the app.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            We use your information to operate Relay's core features: authenticating you, displaying your messages and profile to other room members, sending account-related emails (OTP verification, password resets, feedback confirmations), and enabling real-time features like typing indicators and online status.
          </Section>

          <Section title="3. Cookies & Sessions">
            Relay uses a single HTTP-only cookie to store your signed-in session (a JWT token). This cookie can't be read by JavaScript and is used solely to keep you logged in — we don't use tracking or advertising cookies.
          </Section>

          <Section title="4. Third-Party Services">
            <ul className="list-disc list-inside flex flex-col gap-1">
              <li><strong className="text-black dark:text-white">Cloudinary</strong> — hosts images and files you upload in chat, and profile photos.</li>
              <li><strong className="text-black dark:text-white">Resend</strong> — delivers account emails (OTP codes, password resets, feedback).</li>
              <li><strong className="text-black dark:text-white">Google Sign-In</strong> — if you choose to sign in with Google, Google shares your name, email, and profile photo with us to create or match your account.</li>
              <li><strong className="text-black dark:text-white">MongoDB</strong> — our database provider, where account and message data is stored.</li>
            </ul>
            Each of these providers has its own privacy practices governing how they handle data on our behalf.
          </Section>

          <Section title="5. Temporary Room Data">
            Messages and participant data in temporary rooms are stored only in server memory and are permanently deleted when the room expires or empties out. This content is never written to our persistent database.
          </Section>

          <Section title="6. Persistent Room Data">
            Messages, images, and files in persistent rooms are stored in our database until deleted by you, a room admin, or through room/account deletion. Editing or deleting a message updates or removes it for everyone in the room in real time.
          </Section>

          <Section title="7. Data Retention & Deletion">
            You can delete your account at any time from your Profile page. This permanently removes your account, your profile photo, and your membership from every room. Message content you previously sent while a member of a still-active room may remain visible to other members, consistent with how group chat platforms typically work.
          </Section>

          <Section title="8. Data Security">
            Passwords are hashed with bcrypt and never stored in plain text. Session cookies are HTTP-only and marked secure in production. We take reasonable measures to protect your data, but no online service can guarantee absolute security.
          </Section>

          <Section title="9. Children's Privacy">
            Relay is not directed at children under 13, and we do not knowingly collect information from children under that age.
          </Section>

          <Section title="10. Changes to This Policy">
            We may update this Privacy Policy from time to time. Continued use of Relay after changes take effect means you accept the updated policy.
          </Section>

          <Section title="11. Contact">
            Questions about this policy can be sent via the "Send Feedback" option in your account menu.
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div>
    <h2 className="font-bold text-black dark:text-white mb-2">{title}</h2>
    <div>{children}</div>
  </div>
);

export default LegalInfo;