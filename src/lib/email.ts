import { Resend } from 'resend';
import { PRIVATE_RESEND_API_KEY } from '$env/static/private';

/**
 * Initialize Resend client with API key from environment variables
 */
console.log('[EMAIL] Initializing Resend client...');
console.log('[EMAIL] API Key present:', PRIVATE_RESEND_API_KEY ? 'Yes' : 'No');
console.log('[EMAIL] API Key length:', PRIVATE_RESEND_API_KEY?.length || 0);

const resend = new Resend(PRIVATE_RESEND_API_KEY);

export interface SendEmailOptions {
	from: string;
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
	replyTo?: string;
}

/**
 * Send an email using Resend
 * @param options Email options
 * @returns Promise with email result
 */
export async function sendEmail(options: SendEmailOptions) {
	console.log('[EMAIL] sendEmail called with options:', {
		from: options.from,
		to: options.to,
		subject: options.subject,
		hasHtml: !!options.html,
		hasText: !!options.text,
		replyTo: options.replyTo
	});

	try {
		console.log('[EMAIL] Sending email via Resend API...');
		const result = await resend.emails.send({
			from: options.from,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			reply_to: options.replyTo
		});

		console.log('[EMAIL] Email sent successfully!');
		console.log('[EMAIL] Result:', JSON.stringify(result, null, 2));

		return {
			success: true,
			data: result.data,
			error: null
		};
	} catch (error) {
		console.error('[EMAIL] Error sending email:', error);
		console.error('[EMAIL] Error details:', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : undefined,
			error: error
		});

		return {
			success: false,
			data: null,
			error: error instanceof Error ? error.message : 'Unknown error occurred'
		};
	}
}

