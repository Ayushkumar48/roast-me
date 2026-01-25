import { clsx, type ClassValue } from 'clsx';
import { marked } from 'marked';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function typewriterEffect(
	fullText: string,
	setter: (text: string) => void,
	speed: number = 30
): () => void {
	let index = 0;
	let cancelled = false;

	const interval = setInterval(() => {
		if (cancelled) {
			clearInterval(interval);
			return;
		}

		if (index <= fullText.length) {
			const charsPerUpdate = 2;
			setter(fullText.slice(0, Math.min(index, fullText.length)));
			index += charsPerUpdate;
		} else {
			clearInterval(interval);
		}
	}, speed);

	// Return cleanup function
	return () => {
		cancelled = true;
		clearInterval(interval);
	};
}

export async function copyRoast(text: string) {
	const html = await getSanitizedMarkdown(text);
	const doc = new DOMParser().parseFromString(html, 'text/html');
	return navigator.clipboard.writeText(doc.body.textContent ?? '');
}

export async function getSanitizedMarkdown(markdown: string) {
	return DOMPurify.sanitize(await marked.parse(markdown));
}

export function getInitials(name: string) {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase();
}

export function formatDateAndTime(date: Date) {
	return date.toLocaleString('en-US', {
		minute: '2-digit',
		hour: '2-digit',
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});
}
