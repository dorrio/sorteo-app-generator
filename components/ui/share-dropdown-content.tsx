import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Copy, Check, Twitter, Facebook, MessageCircle, Instagram, Share2, ImageIcon } from "lucide-react"

interface ShareDropdownContentProps {
  copyToClipboard: () => Promise<void>
  shareInstagram: () => Promise<void>
  /** Viralis: Optional handler for native system share (e.g. on Desktop Safari) */
  onSystemShare?: () => Promise<void>
  /** Viralis: Optional handler to copy the generated OG image to clipboard */
  onCopyImage?: () => Promise<void>
  copied: boolean
  imageCopied?: boolean
  twitterUrl: string
  facebookUrl: string
  whatsappUrl: string
  translations: {
    share?: string
    copy: string
    copied: string
    copyImage?: string
    imageCopied?: string
    shareOn?: string
  }
  align?: "center" | "end" | "start"
  className?: string
}

export function ShareDropdownContent({
  copyToClipboard,
  shareInstagram,
  onSystemShare,
  onCopyImage,
  copied,
  imageCopied,
  twitterUrl,
  facebookUrl,
  whatsappUrl,
  translations,
  align = "end",
  className
}: ShareDropdownContentProps) {
  return (
    <DropdownMenuContent align={align} className={className || "w-48"}>
      {/* System Share Option for Desktop Safari/Edge */}
      {onSystemShare && (
        <DropdownMenuItem onClick={onSystemShare} className="gap-2 cursor-pointer font-medium">
          <Share2 className="w-4 h-4" />
          {translations.share || "Share"}
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

      {/* Direct Copy Image for Desktop Sharing */}
      {onCopyImage && (
        <DropdownMenuItem onClick={onCopyImage} className="gap-2 cursor-pointer">
          {imageCopied ? (
            <>
              <Check className="w-4 h-4 text-green-500" />
              <span className="text-green-500">{translations.imageCopied || "Image Copied"}</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              {translations.copyImage || "Copy Image"}
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
