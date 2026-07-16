"use client";

import Link from "next/link";
import { ChevronLeft, Printer } from "lucide-react";
import { usePathname } from "next/navigation";

export default function LegalPolicy() {
  const pathname = usePathname();
  const policySlug = pathname.split('/').pop() || '';
  
  const policyName = policySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + (policySlug === 'privacy' || policySlug === 'cookie' ? ' Policy' : '');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-500 pb-24">
      
      <div className="flex items-center justify-between mb-12">
        <Link href="/legal" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Legal Center
        </Link>
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors print:hidden"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="grid lg:grid-cols-[250px_1fr] gap-12 items-start max-w-5xl mx-auto">
        
        {/* SIDEBAR (TOC) */}
        <div className="hidden lg:block sticky top-24 space-y-8">
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Table of Contents</div>
            <ul className="space-y-3 border-l-2 border-muted pl-4">
              <li><a href="#" className="text-sm font-bold text-foreground hover:text-blue-500 transition-colors block -ml-[17px] border-l-2 border-blue-500 pl-4">1. Introduction</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors block">2. Information We Collect</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors block">3. How We Use Information</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors block">4. Data Sharing</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors block">5. Your Rights</a></li>
              <li><a href="#" className="text-sm font-bold text-muted-foreground hover:text-blue-500 transition-colors block">6. Contact Information</a></li>
            </ul>
          </div>
          <div className="bg-muted/50 rounded-xl p-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Have Questions?</div>
            <p className="text-xs font-medium text-foreground mb-3">If you have any questions about this policy, please reach out to our legal team.</p>
            <Link href="/contact" className="text-xs font-bold text-blue-500 hover:underline">Contact Support</Link>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="max-w-[700px]">
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight mb-6">{policyName}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
              <span>Last Updated: October 24, 2026</span>
              <span>•</span>
              <span>Effective Date: November 1, 2026</span>
              <span>•</span>
              <span>Est. Reading Time: 10 mins</span>
            </div>
          </div>

          <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-extrabold prose-p:font-medium prose-p:leading-relaxed prose-li:font-medium">
            <p>
              At Avenpath, transparency and trust are fundamental to our mission of providing accessible education. This {policyName} explains our practices in a clear, readable format.
            </p>

            <h2>1. Introduction</h2>
            <p>
              Welcome to Avenpath. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us at <a href="mailto:privacy@avenpath.edu">privacy@avenpath.edu</a>.
            </p>
            <p>
              When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it, and what rights you have in relation to it.
            </p>

            <h2>2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when registering at the website, expressing an interest in obtaining information about us or our products and services, when participating in activities on the website, or otherwise contacting us.
            </p>
            <ul>
              <li><strong>Personal Information Provided by You:</strong> We collect names, email addresses, usernames, passwords, educational level, and other similar information.</li>
              <li><strong>Payment Data:</strong> (Future) We may collect data necessary to process your payment if you make purchases.</li>
              <li><strong>Learning Data:</strong> We track lesson completion, quiz scores, and subject preferences to personalize your experience.</li>
            </ul>

            <h2>3. How We Use Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
            </p>
            <p>
              Specifically, we use the information we collect or receive to:
            </p>
            <ul>
              <li>Facilitate account creation and logon process.</li>
              <li>Send you administrative information, such as product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
              <li>Fulfill and manage your learning path.</li>
              <li>Deliver targeted recommendations to you.</li>
            </ul>

            <h2>4. Data Sharing</h2>
            <p>
              We only share and disclose your information in the following situations:
            </p>
            <ul>
              <li><strong>Compliance with Laws:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
              <li><strong>Vital Interests and Legal Rights:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, and illegal activities.</li>
            </ul>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 my-8">
              <h4 className="font-extrabold text-blue-600 dark:text-blue-400 mt-0 mb-2">We never sell your data</h4>
              <p className="text-sm font-medium m-0 text-blue-900 dark:text-blue-100">
                Avenpath is an educational platform, not a data broker. We do not and will never sell your personal information to third parties for advertising or marketing purposes.
              </p>
            </div>

            <h2>5. Your Rights</h2>
            <p>
              In some regions, such as the European Economic Area (EEA) and United Kingdom (UK), you have certain rights under applicable data protection laws. These may include the right to:
            </p>
            <ol>
              <li>Request access and obtain a copy of your personal information.</li>
              <li>Request rectification or erasure.</li>
              <li>Restrict the processing of your personal information.</li>
              <li>Data portability.</li>
            </ol>
            <p>
              You can exercise these rights through your Account Settings or by contacting us directly.
            </p>

            <h2>6. Contact Information</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <a href="mailto:legal@avenpath.edu">legal@avenpath.edu</a> or by post to:
            </p>
            <address className="not-italic font-bold text-sm bg-muted/30 p-4 rounded-xl border border-border mt-4">
              Avenpath Education<br />
              123 Learning Way, Suite 400<br />
              San Francisco, CA 94105<br />
              United States
            </address>
          </article>
        </div>

      </div>

    </div>
  );
}
