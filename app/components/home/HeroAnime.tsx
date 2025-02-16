import React, { useEffect, useState } from 'react'
import { translateWithCache } from '../../utils/translate'
import { formatDescription } from '../../utils/formatDescription'

const HeroAnime: React.FC = () => {
  const [featuredAnime, setFeaturedAnime] = useState(null)
  const [formattedDescription, setFormattedDescription] = useState('')

  useEffect(() => {
    async function formatDesc() {
      if (featuredAnime?.description) {
        try {
          // First translate the description
          const translatedDesc = await translateWithCache(featuredAnime.description)
          // Then format the translated description
          const formatted = await formatDescription(translatedDesc)
          setFormattedDescription(formatted)
        } catch (error) {
          console.error("Error formatting description:", error)
          // If translation fails, try to at least format the original description
          try {
            const formatted = await formatDescription(featuredAnime.description)
            setFormattedDescription(formatted)
          } catch {
            setFormattedDescription(featuredAnime.description)
          }
        }
      }
    }
    formatDesc()
  }, [featuredAnime?.description])

  return (
    <div>
      {/* Render your component content here */}
    </div>
  )
}

export default HeroAnime 