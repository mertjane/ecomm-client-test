'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ContactForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    surname: '',
    company: '',
    telephone: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // TODO: Implement actual form submission to WordPress Contact Form 7 API
      // For now, simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message. We will get back to you soon!',
      });

      // Reset form
      setFormData({
        first_name: '',
        surname: '',
        company: '',
        telephone: '',
        email: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-8">
      <h5 className="text-foreground mb-6">Send us a message</h5>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name and Surname */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name*"
              required
              maxLength={400}
              className={cn(
                'w-full px-4 py-3 rounded-md border border-input',
                'bg-background text-foreground',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all'
              )}
            />
          </div>
          <div>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Surname*"
              required
              maxLength={400}
              className={cn(
                'w-full px-4 py-3 rounded-md border border-input',
                'bg-background text-foreground',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all'
              )}
            />
          </div>
        </div>

        {/* Company */}
        <div>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company"
            maxLength={400}
            className={cn(
              'w-full px-4 py-3 rounded-md border border-input',
              'bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-all'
            )}
          />
        </div>

        {/* Telephone and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Telephone"
              maxLength={400}
              className={cn(
                'w-full px-4 py-3 rounded-md border border-input',
                'bg-background text-foreground',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all'
              )}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              required
              maxLength={400}
              className={cn(
                'w-full px-4 py-3 rounded-md border border-input',
                'bg-background text-foreground',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                'transition-all'
              )}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message*"
            required
            maxLength={2000}
            rows={6}
            className={cn(
              'w-full px-4 py-3 rounded-md border border-input',
              'bg-background text-foreground',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
              'transition-all resize-none'
            )}
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full md:w-auto px-8 py-3 rounded-md',
              'bg-emperador text-white font-medium uppercase tracking-wide',
              'hover:bg-emperador/90 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-emperador focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </button>
        </div>

        {/* Status Message */}
        {submitStatus.type && (
          <div
            className={cn(
              'p-4 rounded-md',
              submitStatus.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
              submitStatus.type === 'error' && 'bg-red-50 text-red-800 border border-red-200'
            )}
          >
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
}
