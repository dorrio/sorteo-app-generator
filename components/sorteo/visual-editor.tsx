"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Palette,
  Type,
  Sparkles,
  Clock,
  X,
  Crown,
  Zap,
  Minimize2,
  ImageIcon,
  Upload,
  Trash2,
  Link,
  Waves,
  Leaf,
  Heart,
  Layers,
  Play,
  CircleDot,
  Layers3,
  Square,
  Terminal,
} from "lucide-react"

export function VisualEditor() {
  const { theme, updateTheme, setPresetTheme, isEditorOpen, setIsEditorOpen } = useSorteoStore()
  const [activeTab, setActiveTab] = useState<"presets" | "colors" | "text" | "effects" | "background">("presets")
  const [imageUrlInput, setImageUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: "presets" as const, label: "Estilos", icon: Crown },
    { id: "colors" as const, label: "Colores", icon: Palette },
    { id: "text" as const, label: "Texto", icon: Type },
    { id: "effects" as const, label: "Efectos", icon: Sparkles },
    { id: "background" as const, label: "Fondo", icon: ImageIcon },
  ]

  const presets = [
    {
      id: "luxury-gold" as const,
      name: "Luxury Gold",
      description: "Elegante y premium",
      colors: ["#D4AF37", "#B8860B", "#0A0A0A"],
      icon: Crown,
    },
    {
      id: "neon-creator" as const,
      name: "Neon Creator",
      description: "Vibrante y gaming",
      colors: ["#FF00FF", "#00FFFF", "#0D0221"],
      icon: Zap,
    },
    {
      id: "minimal-elegance" as const,
      name: "Minimal Elegance",
      description: "Limpio y sofisticado",
      colors: ["#FFFFFF", "#888888", "#000000"],
      icon: Minimize2,
    },
    {
      id: "rose-gold" as const,
      name: "Rose Gold",
      description: "Suave y romántico",
      colors: ["#E8B4B8", "#B76E79", "#1A1215"],
      icon: Heart,
    },
    {
      id: "ocean-depth" as const,
      name: "Ocean Depth",
      description: "Fresco y profundo",
      colors: ["#00D9FF", "#0099CC", "#0A1929"],
      icon: Waves,
    },
    {
      id: "forest-mist" as const,
      name: "Forest Mist",
      description: "Natural y sereno",
      colors: ["#90EE90", "#228B22", "#0D1F0D"],
      icon: Leaf,
    },
  ]

  const sorteoStyles = [
    {
      id: "slot-machine" as const,
      name: "Slot Machine",
      description: "Clásico estilo tragamonedas",
      icon: Play,
    },
    {
      id: "roulette" as const,
      name: "Ruleta",
      description: "Nombres girando en círculo",
      icon: CircleDot,
    },
    {
      id: "cascade" as const,
      name: "Cascada",
      description: "Nombres cayendo suavemente",
      icon: Layers3,
    },
    {
      id: "cards" as const,
      name: "Cartas",
      description: "Baraja que se voltea",
      icon: Square,
    },
    {
      id: "matrix" as const,
      name: "Matrix",
      description: "Estilo código futurista",
      icon: Terminal,
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updateTheme({ backgroundImage: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = () => {
    if (imageUrlInput.trim()) {
      updateTheme({ backgroundImage: imageUrlInput.trim() })
      setImageUrlInput("")
    }
  }

  const handleRemoveBackground = () => {
    updateTheme({ backgroundImage: undefined })
  }

  return (
    <AnimatePresence>
      {isEditorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditorOpen(false)}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Editor panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-display font-bold">Editor Visual</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsEditorOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[70px] flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors ${
                    activeTab === tab.id ? "text-primary border-b-2" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={activeTab === tab.id ? { borderColor: theme.primaryColor, color: theme.primaryColor } : {}}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {activeTab === "presets" && (
                  <motion.div
                    key="presets"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setPresetTheme(preset.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          theme.style === preset.id ? "border-primary" : "border-border hover:border-border/80"
                        }`}
                        style={theme.style === preset.id ? { borderColor: theme.primaryColor } : {}}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: preset.colors[0] + "20" }}
                          >
                            <preset.icon className="w-5 h-5" style={{ color: preset.colors[0] }} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{preset.name}</div>
                            <div className="text-sm text-muted-foreground">{preset.description}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {preset.colors.map((color, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full border border-border/50"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}

                {activeTab === "colors" && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label>Color Principal</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={theme.primaryColor}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="w-14 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={theme.primaryColor}
                          onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                          className="flex-1 font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Color Secundario</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={theme.secondaryColor}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="w-14 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={theme.secondaryColor}
                          onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                          className="flex-1 font-mono uppercase"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Radio de bordes</Label>
                      <Slider
                        value={[theme.borderRadius]}
                        onValueChange={([value]) => updateTheme({ borderRadius: value })}
                        max={24}
                        step={2}
                      />
                      <span className="text-xs text-muted-foreground">{theme.borderRadius}px</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label>Título del Sorteo</Label>
                      <Input
                        value={theme.customTitle}
                        onChange={(e) => updateTheme({ customTitle: e.target.value })}
                        placeholder="SORTEO"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subtítulo</Label>
                      <Input
                        value={theme.customSubtitle}
                        onChange={(e) => updateTheme({ customSubtitle: e.target.value })}
                        placeholder="El momento ha llegado"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipografía</Label>
                      <select
                        value={theme.fontFamily}
                        onChange={(e) => updateTheme({ fontFamily: e.target.value })}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border"
                      >
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Inter">Inter</option>
                        <option value="system-ui">System UI</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {activeTab === "effects" && (
                  <motion.div
                    key="effects"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Estilo del Sorteo
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {sorteoStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => updateTheme({ sorteoStyle: style.id })}
                            className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                              (theme.sorteoStyle ?? "slot-machine") === style.id
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-border/80"
                            }`}
                            style={
                              (theme.sorteoStyle ?? "slot-machine") === style.id
                                ? { borderColor: theme.primaryColor }
                                : {}
                            }
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor:
                                  (theme.sorteoStyle ?? "slot-machine") === style.id
                                    ? `${theme.primaryColor}30`
                                    : "transparent",
                              }}
                            >
                              <style.icon
                                className="w-4 h-4"
                                style={{
                                  color:
                                    (theme.sorteoStyle ?? "slot-machine") === style.id
                                      ? theme.primaryColor
                                      : "currentColor",
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{style.name}</div>
                              <div className="text-xs text-muted-foreground">{style.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-4" />

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Confeti</Label>
                        <p className="text-sm text-muted-foreground">Lluvia de confeti al ganar</p>
                      </div>
                      <Switch
                        checked={theme.showConfetti}
                        onCheckedChange={(checked) => updateTheme({ showConfetti: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Fondo Dinámico</Label>
                        <p className="text-sm text-muted-foreground">Partículas animadas de fondo</p>
                      </div>
                      <Switch
                        checked={theme.showDynamicBackground ?? true}
                        onCheckedChange={(checked) => updateTheme({ showDynamicBackground: checked })}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Vista de Participantes
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateTheme({ participantDisplay: "list" })}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            theme.participantDisplay === "list" || !theme.participantDisplay
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-border/80"
                          }`}
                          style={
                            theme.participantDisplay === "list" || !theme.participantDisplay
                              ? { borderColor: theme.primaryColor }
                              : {}
                          }
                        >
                          Lista
                        </button>
                        <button
                          onClick={() => updateTheme({ participantDisplay: "bubbles" })}
                          className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                            theme.participantDisplay === "bubbles"
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-border/80"
                          }`}
                          style={theme.participantDisplay === "bubbles" ? { borderColor: theme.primaryColor } : {}}
                        >
                          Burbujas
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <Label>Cuenta Regresiva</Label>
                      </div>
                      <Slider
                        value={[theme.countdownDuration]}
                        onValueChange={([value]) => updateTheme({ countdownDuration: value })}
                        min={3}
                        max={10}
                        step={1}
                      />
                      <span className="text-xs text-muted-foreground">{theme.countdownDuration} segundos</span>
                    </div>

                    <div className="space-y-2">
                      <Label>Duración del Sorteo</Label>
                      <Slider
                        value={[theme.spinDuration]}
                        onValueChange={([value]) => updateTheme({ spinDuration: value })}
                        min={2}
                        max={8}
                        step={0.5}
                      />
                      <span className="text-xs text-muted-foreground">{theme.spinDuration} segundos</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "background" && (
                  <motion.div
                    key="background"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {/* Current background preview */}
                    {theme.backgroundImage && (
                      <div className="space-y-2">
                        <Label>Vista previa</Label>
                        <div className="relative rounded-xl overflow-hidden border border-border aspect-video">
                          <img
                            src={theme.backgroundImage || "/placeholder.svg"}
                            alt="Background preview"
                            className="w-full h-full object-cover"
                            style={{
                              opacity: (theme.backgroundOpacity ?? 30) / 100,
                              filter: `blur(${theme.backgroundBlur ?? 0}px)`,
                            }}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveBackground}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Upload section */}
                    <div className="space-y-3">
                      <Label>Subir imagen</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="w-full h-24 border-dashed flex flex-col gap-2 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-6 h-6" />
                        <span className="text-sm">Haz clic para subir una imagen</span>
                      </Button>
                    </div>

                    {/* URL input */}
                    <div className="space-y-2">
                      <Label>O pegar URL de imagen</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="pl-9"
                            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                          />
                        </div>
                        <Button onClick={handleUrlSubmit} disabled={!imageUrlInput.trim()}>
                          Aplicar
                        </Button>
                      </div>
                    </div>

                    {/* Opacity control */}
                    <div className="space-y-2">
                      <Label>Opacidad del fondo</Label>
                      <Slider
                        value={[theme.backgroundOpacity ?? 30]}
                        onValueChange={([value]) => updateTheme({ backgroundOpacity: value })}
                        min={10}
                        max={100}
                        step={5}
                      />
                      <span className="text-xs text-muted-foreground">{theme.backgroundOpacity ?? 30}%</span>
                    </div>

                    {/* Blur control */}
                    <div className="space-y-2">
                      <Label>Desenfoque</Label>
                      <Slider
                        value={[theme.backgroundBlur ?? 0]}
                        onValueChange={([value]) => updateTheme({ backgroundBlur: value })}
                        min={0}
                        max={20}
                        step={1}
                      />
                      <span className="text-xs text-muted-foreground">{theme.backgroundBlur ?? 0}px</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
