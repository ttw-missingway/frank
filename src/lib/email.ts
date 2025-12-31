import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

/**
 * Get Resend client instance (lazy initialization)
 */
function getResendClient() {
	const apiKey = env.PRIVATE_RESEND_API_KEY;
	if (!apiKey) {
		throw new Error('PRIVATE_RESEND_API_KEY is not set in environment variables');
	}
	return new Resend(apiKey);
}

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
		const resend = getResendClient();
		console.log('[EMAIL] Sending email via Resend API...');
		const result = await resend.emails.send({
			from: options.from,
			to: options.to,
			subject: options.subject,
			html: options.html,
			text: options.text,
			replyTo: options.replyTo
		} as Parameters<typeof resend.emails.send>[0]);

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

