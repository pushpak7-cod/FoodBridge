'use client';

import React from 'react';
import Link from 'next/link';
import GlassPanel from '@/components/GlassPanel';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  MapPin,
  FileCheck2,
  Building2,
  Utensils,
  Truck,
  ArrowLeft,
  Mail,
  CheckCircle2,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors px-3 py-1.5 rounded-xl bg-white/60 border border-white hover:bg-white shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-trust/10 text-accent-trust text-xs font-semibold border border-accent-trust/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Digital Personal Data Protection Act (DPDP India 2023) Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-ink tracking-tight">
            FoodBridge Privacy Policy & Trust Contract
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Effective Date: October 2026 • Governing Law: Information Technology Act 2000 & DPDP Act 2023 (Republic of India)
          </p>
        </div>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassPanel variant="standard" className="p-5 space-y-2 border border-white/80">
          <div className="w-8 h-8 rounded-xl bg-accent-primary-subtle text-accent-primary flex items-center justify-center">
            <EyeOff className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-xs text-ink">Anonymized Discovery</h2>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Restaurant and NGO direct contact details remain shielded during proximity search until a mutual tie-up is confirmed.
          </p>
        </GlassPanel>

        <GlassPanel variant="standard" className="p-5 space-y-2 border border-white/80">
          <div className="w-8 h-8 rounded-xl bg-accent-trust-subtle text-accent-trust flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-xs text-ink">Ephemeral GPS Only</h2>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Vehicle geolocation is tracked strictly during active food delivery routes and terminates immediately upon delivery OTP verification.
          </p>
        </GlassPanel>

        <GlassPanel variant="standard" className="p-5 space-y-2 border border-white/80">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-xs text-ink">Encrypted Verification</h2>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            FSSAI licences, Darpan IDs, and OTP handoffs are stored with bcrypt hashing and signed JWT authentication.
          </p>
        </GlassPanel>
      </div>

      {/* Detailed Legal Sections */}
      <GlassPanel variant="prominent" className="p-7 sm:p-10 space-y-8 border border-white/90 text-sm text-ink-muted leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">1</span>
            Data We Collect for Food Safety & Verification
          </h2>
          <p>
            To uphold rigorous food safety and humanitarian standards under the Food Safety and Standards Act (FSSA 2006) and Indian legal guidelines, FoodBridge collects specific verified information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li><strong>Restaurant & Kitchen Partners:</strong> Business legal name, FSSAI 14-digit license number and expiry, GSTIN, FoSTaC certified supervisor name, establishment address, and dock contact phone.</li>
            <li><strong>NGO Partners:</strong> Registered charitable trust/society name, NGO Darpan ID issued by NITI Aayog, PAN number, Section 12A/80G status, authorized signatory details, and storage capacity metrics.</li>
            <li><strong>Volunteer Drivers:</strong> Driving licence number, vehicle registration number (RC), pollution certificate (PUC), and emergency contact numbers under the Motor Vehicles Act.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 pt-4 border-t border-stone-200/50">
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">2</span>
            How Your Location Data Is Handled (Live GPS Policy)
          </h2>
          <p>
            We strictly respect the privacy of drivers and staff. Geolocation data is utilized strictly for route calculation and delivery ETA:
          </p>
          <p className="text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <strong>No Background Tracking:</strong> Driver GPS coordinates are received only while an active transport is in status <code>en_route</code> or <code>in_transit</code>. The moment the NGO recipient enters the Delivery Receipt OTP, the GPS tracking session automatically terminates.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 pt-4 border-t border-stone-200/50">
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">3</span>
            Donor Confidentiality & Non-Disclosure of Food Waste Volumes
          </h2>
          <p>
            We recognize that commercial kitchens require discretion regarding operational surplus:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>Surplus listings are presented during discovery with general distance metrics rather than private kitchen back-doors.</li>
            <li>Aggregated ESG and CSR impact figures celebrate meals saved and carbon diverted without exposing private commercial inventory margins to competitors.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 pt-4 border-t border-stone-200/50">
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">4</span>
            Cookies, Sessions & Storage Security
          </h2>
          <p>
            FoodBridge employs industry-standard <code>HttpOnly</code>, <code>SameSite=Lax</code> JWT session cookies. User passwords are never stored in plaintext and are hashed using <strong>bcrypt with 12 salt rounds</strong>. Session tokens expire automatically after 7 days and can be revoked instantly upon sign-out.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 pt-4 border-t border-stone-200/50">
          <h2 className="text-lg font-serif font-bold text-ink flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center text-xs font-bold">5</span>
            Grievance Redressal Officer (DPDP Act 2023)
          </h2>
          <p>
            In compliance with Section 10 of the Digital Personal Data Protection Act 2023, you have the right to access, rectify, or request deletion of your verified account details.
          </p>
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1 text-xs">
            <div className="font-bold text-ink">Data Protection & Grievance Redressal Desk</div>
            <div>FoodBridge India Network Operations</div>
            <div>MG Road / Indiranagar, Bengaluru, Karnataka — 560038</div>
            <div className="text-accent-primary font-medium">privacy@foodbridge.in • grievance@foodbridge.in</div>
          </div>
        </section>
      </GlassPanel>

      {/* Footer Back Link */}
      <div className="flex items-center justify-between text-xs text-ink-muted">
        <Link href="/" className="hover:text-ink font-semibold flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to FoodBridge Home</span>
        </Link>
        <span>Zero Food Waste • Verified Trust</span>
      </div>
    </div>
  );
}
