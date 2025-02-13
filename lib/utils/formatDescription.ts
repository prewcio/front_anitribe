import { marked } from "marked"

export async function formatDescription(description: string | null): Promise<string> {
  if (!description) return ""

  // First, convert all types of line breaks to \n
  let formattedText = description
    .replace(/\\n/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    
  // Normalize multiple line breaks to maximum two
  formattedText = formattedText
    .split('\n')
    .filter(line => line.trim() !== '') // Remove empty lines
    .join('\n\n')

  // Replace anilist.co URLs with anitribe.pl
  formattedText = formattedText.replace(/https:\/\/anilist\.co\//g, "https://anitribe.pl/")

  // Parse markdown to HTML
  formattedText = await marked(formattedText, { breaks: true })

  // Clean up any remaining multiple <br> tags that might have been introduced
  formattedText = formattedText
    .replace(/(<br\s*\/?>\s*){3,}/gi, '<br /><br />')

  return formattedText
}

