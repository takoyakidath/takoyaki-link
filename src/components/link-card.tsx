import type { Link } from "../lib/links"
import { Instagram, Github, Globe,XIcon,MessageCircle } from "lucide-react"

const iconMap = {
  instagram: Instagram,
  twitter: XIcon,
  github: Github,
  globe: Globe,
  discord: MessageCircle, 
}

interface LinkCardProps {
  link: Link
}

export function LinkCard({ link }: LinkCardProps) {
  const Icon = link.icon ? iconMap[link.icon as keyof typeof iconMap] : Globe

  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block w-full">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:scale-[1.02] hover:border-primary hover:shadow-lg">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
          {link.content && <p className="text-sm text-muted-foreground">{link.content}</p>}
        </div>
      </div>
    </a>
  )
}
