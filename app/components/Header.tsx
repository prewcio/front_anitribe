import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchBar from "./SearchBar"
import { useLanguage } from "@/lib/i18n/LanguageContext"

export default function Header() {
  const { translations: t } = useLanguage()

  return (
    <header className="bg-background-secondary border-b border-border h-16 fixed w-[calc(100%-4rem)] ml-16 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-2xl font-bold text-primary">
            AniTribe
          </Link>
          <div className="flex space-x-4">
            <Link href="/" className="text-text-secondary hover:text-text">
              {t.common.home}
            </Link>
            <Link href="/profile" className="text-text-secondary hover:text-text">
              {t.common.profile}
            </Link>
            <Link href="/anime" className="text-text-secondary hover:text-text">
              {t.common.animeList}
            </Link>
            <Link href="/manga" className="text-text-secondary hover:text-text">
              {t.common.mangaList}
            </Link>
            <Link href="/browse" className="text-text-secondary hover:text-text">
              {t.common.browse}
            </Link>
            <Link href="/forum" className="text-text-secondary hover:text-text">
              {t.common.forum}
            </Link>
          </div>
        </nav>
        <div className="flex items-center space-x-4">
          <SearchBar />
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

