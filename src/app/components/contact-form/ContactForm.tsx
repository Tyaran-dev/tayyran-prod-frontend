'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaPaperPlane, FaSpinner, FaCheckCircle } from 'react-icons/fa';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const inputClass =
  'w-full h-12 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#016733] focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed';

const textareaClass =
  'w-full min-h-[160px] rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#016733] focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed resize-none';

export default function ContactForm() {
  const t = useTranslations('ContactForm');
  const dir = t('dir') || 'ltr';
  
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !subject || !message) {
      setStatus('error');
      setErrorMessage(t('errors.required'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage(t('errors.invalidEmail'));
      return;
    }

    // Here you would typically send the data to your API
    // For now, we'll simulate a successful submission
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, subject, message }),
    // });
    // if (!response.ok) throw new Error('Failed to send message');

    setStatus('success');
    e.currentTarget.reset();
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#016733]/10 mb-6">
          <FaCheckCircle className="w-8 h-8 text-[#016733]" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('success.title')}</h3>
        <p className="text-slate-600 max-w-md mx-auto mb-8">
          {t('success.message')}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90"
          style={{
            background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
          }}
        >
          {t('success.button')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={dir}>
      <div className={`grid sm:grid-cols-2 gap-6 ${dir === 'rtl' ? 'rtl' : ''}`}>
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            {t('fields.name.label')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder={t('fields.name.placeholder')}
            required
            disabled={status === 'submitting'}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            {t('fields.email.label')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t('fields.email.placeholder')}
            required
            disabled={status === 'submitting'}
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">
          {t('fields.subject.label')}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder={t('fields.subject.placeholder')}
          required
          disabled={status === 'submitting'}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
          {t('fields.message.label')}
        </label>
        <textarea
          id="message"
          name="message"
          placeholder={t('fields.message.placeholder')}
          required
          disabled={status === 'submitting'}
          className={textareaClass}
        />
      </div>

      {status === 'error' && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full inline-flex items-center justify-center gap-3 h-12 rounded-lg font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: 'linear-gradient(58.16deg, #016733 -6.21%, #1c1466 103.2%)',
        }}
      >
        {status === 'submitting' ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin" />
            {t('buttons.sending')}
          </>
        ) : (
          <>
            <FaPaperPlane className="w-4 h-4" />
            {t('buttons.send')}
          </>
        )}
      </button>
    </form>
  );
}