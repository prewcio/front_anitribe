export async function translateToPolish(text: string): Promise<string> {
  try {
    const response = await fetch("https://translation.googleapis.com/language/translate/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: "pl",
        format: "text",
      }),
    })

    const data = await response.json()
    return data.data.translations[0].translatedText
  } catch (error) {
    console.error("Translation error:", error)
    return text // Fallback to original text if translation fails
  }
}

