import React, { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ApplicationForm() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileRef.current) return;

    const files = Array.from(fileRef.current.files || []);

    for (const f of files) {
      if (f.size > MAX_FILE_SIZE) {
        alert(`File "${f.name}" is larger than 10MB`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob-upload',
        });

        uploadedUrls.push(blob.url);
      }

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          message,
          files: uploadedUrls,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error('API error', data);
        alert('Failed to send application');
        return;
      }

      alert('Application sent successfully');
      setName('');
      setPhone('');
      setMessage('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert('Unexpected error sending application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        required
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        required
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white min-h-[80px]"
      />
      <input
        type="file"
        multiple
        ref={fileRef}
        className="text-xs text-gray-300"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-40"
      >
        {isSubmitting ? 'Sending...' : 'Send Application'}
      </button>
    </form>
  );
}

