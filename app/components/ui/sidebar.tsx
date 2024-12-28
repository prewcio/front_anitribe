import Link from "next/link"
import { User, Bell, Settings, Heart, AppWindow, LogOut } from "lucide-react"

export default function Sidebar() {
  return (
    <aside className="w-16 bg-background-secondary border-r border-border min-h-screen fixed">
      <div className="flex flex-col items-center py-4 space-y-6">
        <Link href="/profile" className="p-2 hover:bg-background rounded-lg">
          <User className="w-6 h-6 text-text-secondary" />
        </Link>
        <Link href="/notifications" className="p-2 hover:bg-background rounded-lg">
          <Bell className="w-6 h-6 text-text-secondary" />
        </Link>
        <Link href="/settings" className="p-2 hover:bg-background rounded-lg">
          <Settings className="w-6 h-6 text-text-secondary" />
        </Link>
        <div className="border-t border-border w-full"></div>
        <Link href="/donate" className="p-2 hover:bg-background rounded-lg">
          <Heart className="w-6 h-6 text-text-secondary" />
        </Link>
        <Link href="/apps" className="p-2 hover:bg-background rounded-lg">
          <AppWindow className="w-6 h-6 text-text-secondary" />
        </Link>
        <Link href="/logout" className="p-2 hover:bg-background rounded-lg mt-auto">
          <LogOut className="w-6 h-6 text-text-secondary" />
        </Link>
      </div>
    </aside>
  )
}

