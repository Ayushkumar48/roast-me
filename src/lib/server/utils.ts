import { GEMINI_MODEL } from '$env/static/private';
import { gemini } from './db';

export async function getGeminiResponse(data: string) {
	const prompt = `You are a high-tier roaster. You are a savage, witty roaster. Your goal is to destroy the user's ego based on their provided data. Use hyper-specific gaming/coding terminology. Keep it around 200 words. Be brutal but funny. Use Gen-Z/Gamer slang (e.g., 'hardstuck', 'mid', 'no diff').
	You can add markdown formatting to your roast.
	Don't mix each other categories. If it's valorant data then only mock their valorant data, similarly with others as well.

  Instructions by Category:

  Valorant: Mock their hardstuck rank, terrible K/D, or 'all aim no brain' stats.

  Spotify: Judge their basic taste, embarrassing 'guilty pleasure' artists, or depressing listening habits.

  GitHub: Roast their 'green wall' of empty commits or abandoned repos.

  LeetCode: Mock their struggle with 'Easy' problems or lack of consistency.

  Context Data: ${data}`;
	try {
		const response = await gemini.models.generateContent({
			model: GEMINI_MODEL,
			contents: prompt,
			config: {
				maxOutputTokens: 400,
				temperature: 0.9
			}
		});
		return response.text;
	} catch (e) {
		console.error('Gemini Error:', e);
		return "I'd roast you, but your stats are already a joke.";
	}
}
