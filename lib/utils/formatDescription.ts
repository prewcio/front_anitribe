import { marked } from "marked"

export function formatDescription(text: string): string {
  // Replace anilist.co URLs with anitribe.pl
  let formattedText = text.replace(/https:\/\/anilist\.co\//g, "https://anitribe.pl/")

  // Parse markdown to HTML using marked
  formattedText = marked(formattedText, { breaks: true })

  return formattedText
}

