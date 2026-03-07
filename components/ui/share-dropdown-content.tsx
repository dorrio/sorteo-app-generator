import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Copy, Check, Twitter, Facebook, MessageCircle, Instagram } from "lucide-react"

interface ShareDropdownContentProps {
  copyToClipboard: () => Promise<void>
  shareInstagram: () => Promise<void>
  copied: boolean
  twitterUrl: string
  facebookUrl: string
  whatsappUrl: string
  translations: {
    copy: string
    copied: string
    shareOn?: string
  }
  align?: "center" | "end" | "start"
  className?: string
}

export function ShareDropdownContent({
  copyToClipboard,
  shareInstagram,
  copied,
  twitterUrl,
  facebookUrl,
  whatsappUrl,
  translations,
  align = "end",
  className
}: ShareDropdownContentProps) {
  return (
    <DropdownMenuContent align={align} className={className || "w-48"}>
      <DropdownMenuItem onClick={copyToClipboard} className="gap-2 cursor-pointer">
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-500">{translations.copied}</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            {translations.copy}
          </>
        )}
      </DropdownMenuItem>

      <DropdownMenuItem asChild className="gap-2 cursor-pointer">
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">
          <Twitter className="w-4 h-4" />
          Twitter / X
        </a>
      </DropdownMenuItem>

      <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
      </DropdownMenuItem>

      <DropdownMenuItem asChild className="gap-2 cursor-pointer">
         <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
          <MessageCircle className="w-4 h-4" />
          WhatsApp
         </a>
      </DropdownMenuItem>

       <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={shareInstagram}
            aria-label={translations.shareOn ? `${translations.shareOn} Instagram` : "Share on Instagram"}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
