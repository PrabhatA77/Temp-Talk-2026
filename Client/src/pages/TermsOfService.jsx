import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          <h1 className="font-extrabold text-2xl dark:text-white">TERMS OF SERVICE</h1>
          <div className="w-9" />
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">Last updated: {lastUpdated}</p>

        <div className="flex flex-col gap-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <Section title="1. Acceptance of Terms">
            By creating an account or using a temporary room on Relay, you agree to these Terms of Service. If you don't agree, please don't use the app.
          </Section>

          <Section title="2. What Relay Is">
            Relay is a real-time chat application offering two kinds of rooms: temporary, anonymous rooms that expire and are wiped after a set duration, and persistent rooms tied to a registered account with message history, media sharing, and admin moderation tools.
          </Section>

          <Section title="3. Accounts">
            You're responsible for keeping your login credentials secure and for all activity under your account. You may sign up with an email and password (verified via a one-time code) or through Google Sign-In. You must provide accurate information and are responsible for keeping it up to date.
          </Section>

          <Section title="4. Acceptable Use">
            You agree not to use Relay to:
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>Harass, threaten, or abuse other users</li>
              <li>Share illegal content, malware, or material that infringes someone else's rights</li>
              <li>Impersonate another person or misrepresent your affiliation with anyone</li>
              <li>Attempt to disrupt, overload, or gain unauthorized access to Relay's systems</li>
              <li>Upload files or images that violate applicable law</li>
            </ul>
            Room admins may kick or block users who violate room-level rules, and we reserve the right to suspend or delete accounts that violate these Terms.
          </Section>

          <Section title="5. Content You Share">
            You retain ownership of messages, images, and files you send. By uploading media, you grant Relay the limited right to store and transmit it (via our hosting provider, Cloudinary) solely to operate the service. You're solely responsible for what you share.
          </Section>

          <Section title="6. Temporary Rooms">
            Temporary rooms and their message history are automatically and permanently deleted when the room expires. We cannot recover this data once it's gone — please don't rely on temporary rooms for anything you need to keep.
          </Section>

          <Section title="7. Persistent Rooms & Moderation">
            Persistent room admins can promote other members to admin, remove (kick) members, block members from rejoining, edit room details, or delete the room entirely (which permanently deletes its message history). Relay is not responsible for moderation decisions made by individual room admins.
          </Section>

          <Section title="8. Account Deletion">
            You may delete your account at any time from your Profile page. This is permanent: your profile, and your membership in every room you're part of, will be removed. Rooms where you were the sole member are deleted; rooms where you were the sole admin automatically promote another member.
          </Section>

          <Section title="9. Service Availability">
            Relay is provided "as is." We don't guarantee uninterrupted availability and may modify, suspend, or discontinue features at any time.
          </Section>

          <Section title="10. Limitation of Liability">
            To the fullest extent permitted by law, Relay and its developer are not liable for indirect, incidental, or consequential damages arising from your use of the service.
          </Section>

          <Section title="11. Changes to These Terms">
            We may update these Terms from time to time. Continued use of Relay after changes take effect means you accept the updated Terms.
          </Section>

          <Section title="12. Contact">
            Questions about these Terms can be sent via the "Send Feedback" option in your account menu.
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

export default TermsOfService;