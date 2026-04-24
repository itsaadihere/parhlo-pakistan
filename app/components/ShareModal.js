"use client";

import { useState } from 'react';
import { Copy, Link2, Mail, MessageSquare, Share2 } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, title, description }) {
  const [copyMessage, setCopyMessage] = useState('Copy course link to clipboard');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this course: ${title}\n\n${description || ''}\n\n${currentUrl}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || 'Learn more about this course.');

  const openShareLink = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopyMessage('URL copied!');
      window.setTimeout(() => setCopyMessage('Copy course link to clipboard'), 2000);
    } catch (error) {
      setCopyMessage('Copy failed. Please copy manually.');
    }
  };

  const actions = [
    {
      key: 'whatsapp-text',
      label: 'WhatsApp text',
      description: 'Share the course via WhatsApp chat',
      icon: MessageSquare,
      action: () => openShareLink(`https://api.whatsapp.com/send?text=${encodedText}`),
    },
    {
      key: 'whatsapp-status',
      label: 'WhatsApp status',
      description: 'Open WhatsApp status composer with the course link',
      icon: MessageSquare,
      action: () => openShareLink(`https://api.whatsapp.com/send?text=${encodedText}`),
    },
    {
      key: 'linkedin-post',
      label: 'LinkedIn Post',
      description: 'Share the course on LinkedIn feed',
      icon: Share2,
      action: () => openShareLink(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`),
    },
    {
      key: 'linkedin-message',
      label: 'LinkedIn Message',
      description: 'Send the course link via LinkedIn message',
      icon: MessageSquare,
      action: () => openShareLink(`https://www.linkedin.com/messaging/compose/?body=${encodedText}`),
    },
    {
      key: 'facebook-post',
      label: 'Facebook Post',
      description: 'Share the course on Facebook',
      icon: Share2,
      action: () => openShareLink(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`),
    },
    {
      key: 'facebook-messenger',
      label: 'Facebook Messenger',
      description: 'Send the course via Facebook Messenger',
      icon: MessageSquare,
      action: () => openShareLink(`https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=145634995501895&redirect_uri=${encodedUrl}`),
    },
    {
      key: 'instagram-message',
      label: 'Instagram Message',
      description: 'Open Instagram and paste the course link into a message',
      icon: Share2,
      action: () => openShareLink('https://www.instagram.com/'),
    },
    {
      key: 'email',
      label: 'Email',
      description: 'Share the course link by email',
      icon: Mail,
      action: () => openShareLink(`mailto:?subject=${encodedTitle}&body=${encodedText}`),
    },
    {
      key: 'copy-url',
      label: 'Copy URL',
      description: copyMessage,
      icon: Copy,
      action: handleCopyUrl,
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-100">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] font-black text-green-600 mb-2">Share Course</p>
            <h2 className="text-3xl font-black text-slate-900">Share "{title}"</h2>
            <p className="text-sm text-gray-500 mt-2">Choose a destination to share the course with your audience or team.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 transition-colors font-black uppercase text-xs tracking-[0.3em]">Close</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {actions.map(({ key, label, description: detail, icon: Icon, action }) => (
            <button
              key={key}
              type="button"
              onClick={action}
              className="group flex items-start gap-4 rounded-3xl border border-gray-100 p-5 text-left hover:border-green-600 hover:bg-green-50 transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-bold text-sm text-slate-900">{label}</p>
                <p className="text-xs text-gray-500 mt-1 leading-5">{detail}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 text-right text-xs text-gray-500">
          Note: Some share options may open the related app or browser page where you can paste or send the link directly.
        </div>
      </div>
    </div>
  );
}
