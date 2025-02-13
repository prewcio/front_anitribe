"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { translateTagToPolish, getTagExplanation, getTagColor, translateTagToEnglish } from "@/lib/utils/tagTranslation"

interface InteractiveTagProps {
  tag: string
  description?: string
}

export function InteractiveTag({ tag }: InteractiveTagProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const polishTag = translateTagToPolish(tag)
  const englishTag = translateTagToEnglish(polishTag)
  const explanation = getTagExplanation(englishTag)
  const color = getTagColor(englishTag)

  const handleBrowseClick = () => {
    router.push(`/browse?genres=${encodeURIComponent(englishTag)}`)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mr-2 mb-2"
          style={{ backgroundColor: `${color}20`, borderColor: color, color: color }}
        >
          {polishTag}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {polishTag} ({englishTag})
          </DialogTitle>
          <DialogDescription>{explanation}</DialogDescription>
        </DialogHeader>
        <Button className="w-full mt-4" onClick={handleBrowseClick}>
          Przeglądaj anime z tym tagiem
        </Button>
      </DialogContent>
    </Dialog>
  )
}

