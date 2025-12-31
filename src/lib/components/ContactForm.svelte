<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { data?: Record<string, string>; errors?: Record<string, string> } | null =
		null;
</script>

<form method="POST" use:enhance>
	<div class="form-group">
		<label for="name">Name</label>
		<input
			type="text"
			id="name"
			name="name"
			value={form?.data?.name || ''}
			required
			aria-invalid={form?.errors?.name ? 'true' : undefined}
			aria-describedby={form?.errors?.name ? 'name-error' : undefined}
		/>
		{#if form?.errors?.name}
			<span id="name-error" class="error">{form.errors.name}</span>
		{/if}
	</div>

	<div class="form-group">
		<label for="email">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			value={form?.data?.email || ''}
			required
			aria-invalid={form?.errors?.email ? 'true' : undefined}
			aria-describedby={form?.errors?.email ? 'email-error' : undefined}
		/>
		{#if form?.errors?.email}
			<span id="email-error" class="error">{form.errors.email}</span>
		{/if}
	</div>

	<div class="form-group">
		<label for="message">Message</label>
		<textarea
			id="message"
			name="message"
			rows="6"
			required
			aria-invalid={form?.errors?.message ? 'true' : undefined}
			aria-describedby={form?.errors?.message ? 'message-error' : undefined}
		>{form?.data?.message || ''}</textarea>
		{#if form?.errors?.message}
			<span id="message-error" class="error">{form.errors.message}</span>
		{/if}
	</div>

	{#if form?.errors?._form}
		<div class="form-error">{form.errors._form}</div>
	{/if}

	<button type="submit">Send Message</button>
</form>

<style>
	form {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		box-sizing: border-box;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #007bff;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
	}

	input[aria-invalid='true'],
	textarea[aria-invalid='true'] {
		border-color: #dc3545;
	}

	.error {
		display: block;
		margin-top: 0.5rem;
		color: #dc3545;
		font-size: 0.875rem;
	}

	.form-error {
		margin-bottom: 1rem;
		padding: 0.75rem;
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
	}

	button {
		width: 100%;
		padding: 0.75rem 1.5rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:hover:not(:disabled) {
		background-color: #0056b3;
	}

	button:disabled {
		background-color: #6c757d;
		cursor: not-allowed;
	}
</style>

