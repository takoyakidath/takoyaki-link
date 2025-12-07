import { LinkCard } from "../components/link-card"
import { links, profileData } from "../lib/links"
import Image from "next/image"

export default function Home() {
  return (
    <main >
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src={profileData.avatar || "/placeholder.svg"}
              alt={profileData.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-primary shadow-xl"
            />
          </div>
          <h1 className="mb-2 text-3xl font-bold ">{profileData.name}</h1>
          <p>{profileData.bio}</p>
        </div>

        <div className="space-y-4">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        <footer className="mt-12 text-center text-sm">
          <p>©2025 All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  )
}
