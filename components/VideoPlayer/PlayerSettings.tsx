import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { playerThemes } from "./themes"
import type { PlayerTheme } from "./types"

const PixelSettings = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="4" height="4" fill="currentColor" />
    <rect x="8" y="2" width="4" height="4" fill="currentColor" />
    <rect x="14" y="2" width="4" height="4" fill="currentColor" />
    <rect x="2" y="8" width="4" height="4" fill="currentColor" />
    <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    <rect x="14" y="8" width="4" height="4" fill="currentColor" />
    <rect x="2" y="14" width="4" height="4" fill="currentColor" />
    <rect x="8" y="14" width="4" height="4" fill="currentColor" />
    <rect x="14" y="14" width="4" height="4" fill="currentColor" />
  </svg>
)

interface PlayerSettingsProps {
  currentTheme: PlayerTheme
  onThemeChange: (theme: PlayerTheme) => void
}

export function PlayerSettings({ currentTheme, onThemeChange }: PlayerSettingsProps) {
  const SettingsIcon = currentTheme.name === "Pixel" ? PixelSettings : Settings2

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Player Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs">Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={currentTheme.name}
          onValueChange={(value) => {
            const theme = playerThemes.find((t) => t.name === value)
            if (theme) onThemeChange(theme)
          }}
        >
          {playerThemes.map((theme) => (
            <DropdownMenuRadioItem key={theme.name} value={theme.name}>
              {theme.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

