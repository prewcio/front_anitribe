import type React from "react"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

interface PlayerContextMenuProps {
  children: React.ReactNode
  className?: string
}

export function PlayerContextMenu({ children, className }: PlayerContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem disabled className="text-sm font-mono">
          AniTribe Player v0.1
        </ContextMenuItem>
        <ContextMenuItem disabled className="text-xs text-muted-foreground">
          InDev
        </ContextMenuItem>
        <ContextMenuItem
          className="text-xs text-blue-500 hover:text-blue-400 cursor-pointer"
          onClick={() => window.open("https://discord.gg/XXX", "_blank")}
        >
          Zgłaszaj błędy na discord.gg/XXX
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

