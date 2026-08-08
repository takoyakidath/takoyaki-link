export interface Link {
  id: number
  title: string
  content?: string
  url: string
  icon?: string
}

export const profileData = {
  name: "takoyakidath",
  avatar: "/icon.png",
  bio: "Welcome to my link collection",
}

export const links: Link[] = [
  {
    id: 2,
    title: "Instagram",
    content: "@takoyakidath",
    url: "https://instagram.com/takoyakidath",
    icon: "instagram",
  },
  {
    id: 3 ,
    title: "Discord",
    content: "@takoyaki_dath",
    url: "https://discord.com/users/1151099184691302421",
    icon: "discord",
  },
  {
    id: 4,
    title: "GitHub",
    content: "@takoyakidath",
    url: "https://github.com/takoyakidath",
    icon: "github",
  },
  {
    id: 1,
    title: "Website",
    content: "My personal blog",
    url: "https://takoyaki.pkopko.jp",
    icon: "globe",
  },
]
