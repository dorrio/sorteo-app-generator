import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle, Instagram, Linkedin, Send, ImageIcon } from "lucide-react"

interface ShareDropdownContentProps {
  copyToClipboard: () => Promise<void>
  shareInstagram: () => Promise<void>
  copied: boolean
  twitterUrl: string
  facebookUrl: string
  whatsappUrl: string
  telegramUrl?: string
  linkedinUrl?: string
  translations: {
    copy: string
    copied: string
    shareOn?: string
    share?: string
    image_copied?: string
    copy_image?: string
  }
  align?: "center" | "end" | "start"
  className?: string
  // For ShareNative
  canShareNative?: boolean
  shareNative?: () => Promise<void> | void
  // For CopyImage
  handleCopyImage?: () => Promise<void>
  imageCopied?: boolean
}

export function ShareDropdownContent({
  copyToClipboard,
  shareInstagram,
  copied,
  twitterUrl,
  facebookUrl,
  whatsappUrl,
  telegramUrl,
  linkedinUrl,
  translations,
  align = "end",
  className,
  canShareNative,
  shareNative,
  handleCopyImage,
  imageCopied
}: ShareDropdownContentProps) {
  return (
    <DropdownMenuContent align={align} className={className || "w-56"}>
      {canShareNative && shareNative && translations.share && (
        <DropdownMenuItem onClick={shareNative} className="gap-2 cursor-pointer font-medium">
          <Share2 className="w-4 h-4" />
          {translations.share}
        </DropdownMenuItem>
      )}

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

      {handleCopyImage && translations.copy_image && translations.image_copied && (
        <DropdownMenuItem onClick={handleCopyImage} className="gap-2 cursor-pointer">
          {imageCopied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">{translations.image_copied}</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              {translations.copy_image}
            </>
          )}
        </DropdownMenuItem>
      )}

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

      {telegramUrl && (
        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
            <Send className="w-4 h-4" />
            Telegram
          </a>
        </DropdownMenuItem>
      )}

      {linkedinUrl && (
        <DropdownMenuItem asChild className="gap-2 cursor-pointer">
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </DropdownMenuItem>
      )}

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
