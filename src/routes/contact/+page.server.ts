import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendEmail } from '$lib/email';

// Disable prerendering for this page since it has form actions
export const prerender = false;

// Configure these based on your needs
const CONTACT_EMAIL = 'dylanwalling@gmail.com'; // Change this to your contact email
const FROM_EMAIL = 'dylanwalling@gmail.com'; // Change this to your verified Resend domain

interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

function validateForm(data: FormData): { valid: boolean; errors: Record<string, string>; values: ContactFormData | null } {
	const errors: Record<string, string> = {};
	const name = data.get('name')?.toString().trim() || '';
	const email = data.get('email')?.toString().trim() || '';
	const message = data.get('message')?.toString().trim() || '';

	// Validate name
	if (!name) {
		errors.name = 'Name is required';
	} else if (name.length < 2) {
		errors.name = 'Name must be at least 2 characters';
	}

	// Validate email
	if (!email) {
		errors.email = 'Email is required';
	} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = 'Please enter a valid email address';
	}

	// Validate message
	if (!message) {
		errors.message = 'Message is required';
	} else if (message.length < 10) {
		errors.message = 'Message must be at least 10 characters';
	}

	if (Object.keys(errors).length > 0) {
		return {
			valid: false,
			errors,
			values: null
		};
	}

	return {
		valid: true,
		errors: {},
		values: { name, email, message }
	};
}

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('[CONTACT] Form action called');
		const data = await request.formData();
		console.log('[CONTACT] Form data received:', {
			name: data.get('name'),
			email: data.get('email'),
			messageLength: data.get('message')?.toString().length || 0
		});

		const validation = validateForm(data);
		console.log('[CONTACT] Validation result:', {
			valid: validation.valid,
			errors: validation.errors
		});

		if (!validation.valid || !validation.values) {
			console.log('[CONTACT] Validation failed, returning errors');
			return fail(400, {
				form: {
					data: Object.fromEntries(data),
					errors: validation.errors
				}
			});
		}

		const { name, email, message } = validation.values;
		console.log('[CONTACT] Validation passed, preparing to send email');
		console.log('[CONTACT] Email config:', {
			from: FROM_EMAIL,
			to: CONTACT_EMAIL,
			replyTo: email
		});

		// Send email using Resend
		const emailResult = await sendEmail({
			from: FROM_EMAIL,
			to: CONTACT_EMAIL,
			replyTo: email,
			subject: `Contact Form: ${name}`,
			html: `
				<h2>New Contact Form Submission</h2>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Message:</strong></p>
				<p>${message.replace(/\n/g, '<br>')}</p>
			`,
			text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}
			`.trim()
		});

		console.log('[CONTACT] Email result:', {
			success: emailResult.success,
			error: emailResult.error,
			data: emailResult.data
		});

		if (!emailResult.success) {
			console.error('[CONTACT] Email sending failed:', emailResult.error);
			return fail(500, {
				form: {
					data: Object.fromEntries(data),
					errors: {
						_form: 'Failed to send email. Please try again later.'
					}
				}
			});
		}

		console.log('[CONTACT] Email sent successfully, returning success');
		return {
			success: true,
			form: null
		};
	}
};

