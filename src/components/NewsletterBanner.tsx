import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setErrorMsg('Please enter an email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 500);
  };

  return (
    <section className="my-20" aria-labelledby="newsletter-heading">
      <div className="relative rounded-3xl overflow-hidden bg-[#121316] text-white p-8 sm:p-12 lg:p-16 border border-[#222631] shadow-2xl">
        {/* Subtle Warm Tarmac Vignette */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/10 text-xs font-bold uppercase tracking-wider mb-4 text-red-400">
            <Mail className="w-3.5 h-3.5" /> The Paddock Dispatch
          </div>

          <h2 id="newsletter-heading" className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
            Technical Motoring Insights. Directly to Your Inbox.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed font-normal">
            Every weekend, we send an unfiltered technical debrief covering next-generation hypercars, powertrain chemistry, and road culture. No sponsored filler.
          </p>

          {status === 'success' ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">You are on the grid.</p>
                <p className="text-xs text-emerald-300">Look for the upcoming Sunday morning dispatch.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="name@example.com"
                  className="flex-1 px-5 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#d90429] focus:border-[#d90429] transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-6 py-3 rounded-lg bg-[#d90429] hover:bg-red-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  {status === 'loading' ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Join Dispatch</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-400 font-semibold">{errorMsg}</p>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Zero spam telemetry. Single-click unsubscribe anytime.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
