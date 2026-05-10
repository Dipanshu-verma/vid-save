export default function PrivacyPolicy() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
        <p className="text-xs text-slate-400 mt-0.5">Last updated: May 2026</p>
      </div>

      <p className="text-sm text-slate-400 leading-relaxed">
        Welcome to Save It Pro ("we", "our", or "us"). This Privacy Policy explains how we handle information when you use our website at vid-save.vercel.app and our Android application. We are committed to protecting your privacy and being fully transparent about our data practices.
      </p>

      <div className="space-y-4">

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">1. Information We Collect</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Save It Pro does not collect, store, or transmit any personally identifiable information about you. We do not require account registration, email address, name, phone number, or any other personal details to use our service. You are entirely anonymous when using Save It Pro.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            When you paste a video URL into our downloader, that URL is sent to our backend server solely to process and retrieve the video download link. We do not log, store, share, or analyze these URLs in any way. Once the download link is generated and returned to your browser, the URL is immediately discarded from our servers.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            We may collect non-personal, aggregated usage data such as the total number of requests processed per day or general server error rates, solely to monitor the health and performance of our infrastructure. This data is statistical only and cannot be used to identify any individual user.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">2. Local Storage and Download History</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Save It Pro uses your browser's localStorage to save your download history locally on your own device. This data is stored exclusively on your device and is never transmitted to our servers, shared with third parties, or accessible to us in any form whatsoever.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            localStorage is a standard browser feature that stores data in a key-value format on your local device. The download history we store via localStorage contains only the video title, platform, and download quality you selected — all of which remain entirely under your control.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            You can view, manage, and permanently delete your download history at any time from the History tab within the app. Clearing your browser data, uninstalling the application, or resetting your device will also remove all locally stored history.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">3. Google AdSense and Third-Party Advertising</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We use Google AdSense to display advertisements on our website. Google AdSense is a third-party advertising service operated by Google LLC. When you visit our website, Google AdSense may place cookies and use web beacons on your device to serve advertisements that are relevant to your interests, based on your browsing activity across websites on the internet.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            These advertising cookies are set and controlled by Google, not by Save It Pro. We do not have access to the data Google collects through these cookies, and we have no ability to read, modify, or delete them. Google's advertising system works independently of our site's own functionality.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            For more information about how Google uses data when you visit websites that use its advertising services, please visit:{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300 transition-colors"
            >
              https://policies.google.com/technologies/ads
            </a>
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            You can opt out of personalised advertising by visiting Google's Ad Settings page:{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300 transition-colors"
            >
              https://www.google.com/settings/ads
            </a>
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            You may also opt out of interest-based advertising from companies participating in the Digital Advertising Alliance by visiting{' '}
            <a
              href="https://optout.aboutads.info/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300 transition-colors"
            >
              optout.aboutads.info
            </a>
            {' '}or the Network Advertising Initiative opt-out page at{' '}
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 underline hover:text-sky-300 transition-colors"
            >
              optout.networkadvertising.org
            </a>.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">4. Cookies</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Save It Pro itself does not set any first-party cookies for tracking, profiling, or analytics purposes. We do not use cookies to identify you, remember your preferences, or track your behaviour across sessions.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            However, third-party services embedded in our website — most notably Google AdSense — may set their own cookies on your device. These cookies are used to deliver personalised advertisements, measure ad campaign effectiveness, and provide frequency capping so the same ad is not shown to you repeatedly.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            You can control and manage cookies through your browser settings. Most modern browsers allow you to view, delete, and block cookies from specific sites or from all sites. Please note that blocking all third-party cookies may affect the way advertisements are displayed, but it will not affect the core functionality of our video downloader.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">5. Third-Party Video Platforms</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Our service interacts with third-party video platforms in order to process your download requests. When you submit a URL, our backend server makes a request to the relevant platform's publicly accessible endpoint to retrieve media information. We do not log, store, or share the content of the videos you download, nor the individual URLs you submit.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Each third-party platform has its own privacy policy and terms of service that govern your use of that platform. Save It Pro is not affiliated with, endorsed by, or in any way officially connected with Instagram, Facebook, WhatsApp, or any other platform whose content users may access through our tool. We encourage you to review those platforms' privacy policies directly on their respective websites.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">6. Children's Privacy</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Save It Pro is not directed at children under the age of 13. We do not knowingly collect any personal information from children under 13. Since we do not collect personal information from any users, there is minimal specific risk to younger users; however, if you are a parent or guardian and believe your child has somehow provided us with personal information, please contact us at the email address below and we will take prompt steps to address your concern.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">7. Data Security</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Since Save It Pro does not collect or retain personal information, the data security risk associated with using our service is minimal. Video URLs submitted to our backend server are processed in memory and discarded immediately after the download link is generated. No URL data is written to disk or stored in a database on our servers.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your locally stored download history — saved via localStorage on your own device — is protected by your device's native security mechanisms, including file system permissions and any device-level encryption you have enabled. We recommend keeping your device and browser updated to benefit from the latest security improvements provided by your browser and operating system vendors.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Our backend servers are hosted on secure, industry-standard cloud infrastructure. We follow standard security practices including HTTPS encryption for all data in transit between your browser and our servers.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">8. Copyright and Content Responsibility</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Save It Pro is a tool designed for personal, offline use only. Users are solely responsible for ensuring they have the legal right to download any content they access through our service. We strongly encourage users to only download content they own, content they have explicit permission to download, or content that is licensed under Creative Commons or similar permissive licences.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Downloading copyrighted content without permission may violate the copyright laws of your country and the terms of service of the respective platform on which the content is hosted. Save It Pro expressly does not condone or support copyright infringement. We are a neutral technology provider and any misuse of our tool for copyright infringement is solely the legal responsibility of the user performing the download.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">9. Your Rights</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Because Save It Pro does not collect personal data about you, most formal data rights (such as the right to access, correct, or delete personal data) do not apply in the traditional sense. However, you retain full control over the download history stored locally on your device and can delete it at any time through the app's History tab or via your browser settings.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            If you are located in the European Economic Area (EEA) or the United Kingdom, you have rights under the General Data Protection Regulation (GDPR) or UK GDPR respectively. Since we do not process your personal data, these rights are satisfied by default. If you have any questions about your rights, please contact us at the email address below.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">10. Changes to This Privacy Policy</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our practices, legal requirements, or the services we offer. When we make material changes, we will update the "Last updated" date at the top of this page. We encourage you to review this Privacy Policy periodically. Your continued use of Save It Pro after any changes to this policy constitutes your acceptance of the revised terms.
          </p>
        </section>

        <section className="bg-slate-800/50 border border-slate-700/30 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-base">11. Contact Us</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
          </p>
          <p className="text-sm">
            <span className="text-slate-400">Email: </span>
            <a
              href="mailto:dhruvvermanhr@gmail.com"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              dhruvvermanhr@gmail.com
            </a>
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            We aim to respond to all privacy-related enquiries within 48 hours on business days.
          </p>
        </section>

      </div>
    </div>
  );
}
