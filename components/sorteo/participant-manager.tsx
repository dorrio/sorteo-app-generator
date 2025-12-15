"use client"

import type React from "react"
import { useTranslations } from "next-intl"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSorteoStore } from "@/lib/sorteo-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Plus,
  Upload,
  Trash2,
  Users,
  FileSpreadsheet,
  Copy,
  X,
  Pencil,
  Check,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

type InputMode = "single" | "bulk" | "csv"

interface DuplicateInfo {
  name: string
  isNew: boolean
  editedName: string
}

interface ParticipantManagerProps {
  showOnlyInput?: boolean
}

function DuplicateItem({
  dup,
  index,
  onApply,
  onRemove,
  theme,
}: {
  dup: DuplicateInfo
  index: number
  onApply: (index: number, newName: string) => void
  onRemove: (index: number) => void
  theme: { primaryColor: string }
}) {
  const [localValue, setLocalValue] = useState(dup.editedName)
  const [isApplied, setIsApplied] = useState(false)
  const hasChanges = localValue !== dup.editedName && !isApplied

  const handleApply = () => {
    onApply(index, localValue)
    setIsApplied(true)
  }
  const t = useTranslations("ParticipantManager")

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value)
              setIsApplied(false)
            }}
            className={`bg-background border-border flex-1 ${isApplied ? "border-green-500/50" : ""}`}
            placeholder={t("duplicates.edit_placeholder")}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleApply}
                size="icon"
                variant={isApplied ? "default" : "outline"}
                className={`shrink-0 ${isApplied ? "bg-green-600 hover:bg-green-700" : ""}`}
                disabled={!hasChanges && isApplied}
                aria-label={isApplied ? t("duplicates.applied") : t("duplicates.apply_change")}
              >
                {isApplied ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isApplied ? t("duplicates.applied") : t("duplicates.apply_change")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onRemove(index)}
              className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label={t("delete_action")}
            >
              <X className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("delete_action")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {dup.isNew ? t("duplicates.status_new") : t("duplicates.status_existing")}
        </p>
        {hasChanges && <p className="text-xs text-amber-500">{t("duplicates.not_applied")}</p>}
        {isApplied && <p className="text-xs text-green-500">{t("duplicates.applied")}</p>}
      </div>
    </div>
  )
}

export function ParticipantManager({ showOnlyInput = false }: ParticipantManagerProps) {
  const {
    participants,
    addParticipant,
    addParticipants,
    removeParticipant,
    updateParticipant,
    clearParticipants,
    theme,
  } = useSorteoStore()
  const t = useTranslations("ParticipantManager")
  const [inputMode, setInputMode] = useState<InputMode>("single")
  const [singleName, setSingleName] = useState("")
  const [bulkText, setBulkText] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [pendingNames, setPendingNames] = useState<string[]>([])
  const [duplicates, setDuplicates] = useState<DuplicateInfo[]>([])

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      updateParticipant(editingId, editingName.trim())
    }
    setEditingId(null)
    setEditingName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const findDuplicates = (newNames: string[]): { duplicates: DuplicateInfo[]; uniqueNames: string[] } => {
    const existingNames = participants.map((p) => p.name.toLowerCase().trim())
    const seen = new Set<string>()
    const duplicateList: DuplicateInfo[] = []
    const uniqueNames: string[] = []

    newNames.forEach((name) => {
      const normalizedName = name.toLowerCase().trim()
      const isDuplicateOfExisting = existingNames.includes(normalizedName)
      const isDuplicateInBatch = seen.has(normalizedName)

      if (isDuplicateOfExisting || isDuplicateInBatch) {
        duplicateList.push({
          name,
          isNew: !isDuplicateOfExisting,
          editedName: name,
        })
      } else {
        uniqueNames.push(name)
        seen.add(normalizedName)
      }
    })

    return { duplicates: duplicateList, uniqueNames }
  }

  const processNames = (names: string[]) => {
    const { duplicates: foundDuplicates, uniqueNames } = findDuplicates(names)

    if (foundDuplicates.length > 0) {
      setPendingNames(uniqueNames)
      setDuplicates(foundDuplicates)
      setShowDuplicateModal(true)
    } else {
      // No duplicates, add all
      addParticipants(names.map((name) => ({ name })))
    }
  }

  const handleAddWithoutDuplicates = () => {
    if (pendingNames.length > 0) {
      addParticipants(pendingNames.map((name) => ({ name })))
    }
    resetModalState()
    setBulkText("")
  }

  const handleAddWithEdited = () => {
    const editedNames = duplicates.map((d) => d.editedName.trim()).filter((name) => name.length > 0)

    const allNames = [...pendingNames, ...editedNames]

    // Re-check for duplicates after editing
    const existingNames = participants.map((p) => p.name.toLowerCase().trim())
    const finalNames = allNames.filter((name) => !existingNames.includes(name.toLowerCase().trim()))

    if (finalNames.length > 0) {
      addParticipants(finalNames.map((name) => ({ name })))
    }

    resetModalState()
    setBulkText("")
  }

  const handleApplyDuplicateEdit = (index: number, newName: string) => {
    setDuplicates((prev) => prev.map((d, i) => (i === index ? { ...d, editedName: newName.trim() } : d)))
  }

  const handleRemoveDuplicate = (index: number) => {
    setDuplicates((prev) => prev.filter((_, i) => i !== index))
  }

  const resetModalState = () => {
    setShowDuplicateModal(false)
    setPendingNames([])
    setDuplicates([])
  }

  const handleAddSingle = () => {
    if (singleName.trim()) {
      const normalizedName = singleName.toLowerCase().trim()
      const isDuplicate = participants.some((p) => p.name.toLowerCase().trim() === normalizedName)

      if (isDuplicate) {
        setPendingNames([])
        setDuplicates([{ name: singleName.trim(), isNew: false, editedName: singleName.trim() }])
        setShowDuplicateModal(true)
      } else {
        addParticipant({ name: singleName.trim() })
        setSingleName("")
      }
    }
  }

  const handleAddBulk = () => {
    if (bulkText.trim()) {
      const names = bulkText
        .split("\n")
        .map((name) => name.trim())
        .filter((name) => name.length > 0)

      processNames(names)
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split("\n")
      const names: string[] = []

      lines.forEach((line, index) => {
        if (index === 0 && (line.toLowerCase().includes("name") || line.toLowerCase().includes("nombre"))) {
          return
        }
        const columns = line.split(",")
        const name = columns[0]?.trim()
        if (name && name.length > 0) {
          names.push(name)
        }
      })

      processNames(names)
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setBulkText(text)
      setInputMode("bulk")
    } catch {
      // Clipboard access denied
    }
  }

  const DuplicateModal = () => (
    <AnimatePresence>
      {showDuplicateModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => resetModalState()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("duplicates.title")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("duplicates.found_text", { count: duplicates.length })}
                  </p>
                </div>
              </div>
            </div>

            {/* Duplicate list - Now uses DuplicateItem component */}
            <div className="p-4 max-h-[300px] overflow-y-auto space-y-3">
              {duplicates.map((dup, index) => (
                <DuplicateItem
                  key={`${dup.name}-${index}`}
                  dup={dup}
                  index={index}
                  onApply={handleApplyDuplicateEdit}
                  onRemove={handleRemoveDuplicate}
                  theme={theme}
                />
              ))}
            </div>

            {/* Info about unique names */}
            {pendingNames.length > 0 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-muted-foreground">
                  {t("duplicates.unique_text", { count: pendingNames.length })}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 border-t border-border bg-secondary/30 flex flex-col gap-2">
              <Button
                onClick={handleAddWithEdited}
                style={{ backgroundColor: theme.primaryColor }}
                className="w-full text-primary-foreground"
              >
                <Check className="w-4 h-4 mr-2" />
                {t("duplicates.add_edited")}
              </Button>
              <Button variant="outline" onClick={handleAddWithoutDuplicates} className="w-full bg-transparent">
                {t("duplicates.continue_unique", { count: pendingNames.length })}
              </Button>
              <Button variant="ghost" onClick={() => resetModalState()} className="w-full text-muted-foreground">
                {t("duplicates.cancel")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (showOnlyInput) {
    return (
      <>
        <DuplicateModal />
        <div className="space-y-3">
          {/* Input mode tabs */}
          <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
            {[
              { mode: "single" as InputMode, label: t("input_mode.single"), icon: Plus },
              { mode: "bulk" as InputMode, label: t("input_mode.bulk"), icon: Copy },
              { mode: "csv" as InputMode, label: t("input_mode.csv"), icon: FileSpreadsheet },
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${inputMode === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
                style={inputMode === mode ? { backgroundColor: theme.primaryColor } : {}}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {inputMode === "single" && (
              <motion.div
                key="single"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex gap-2"
              >
                <Input
                  placeholder={t("single_placeholder")}
                  value={singleName}
                  onChange={(e) => setSingleName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSingle()}
                  className="flex-1 bg-card border-border h-9 text-sm"
                />
                <Button
                  onClick={handleAddSingle}
                  size="sm"
                  style={{ backgroundColor: theme.primaryColor }}
                  className="text-primary-foreground h-9"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </motion.div>
            )}

            {inputMode === "bulk" && (
              <motion.div
                key="bulk"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-2"
              >
                <Textarea
                  placeholder={t("bulk_placeholder")}
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="min-h-[80px] bg-card border-border font-mono text-xs"
                />
                <Button
                  onClick={handleAddBulk}
                  size="sm"
                  className="w-full"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {t("add_participants_button", { count: bulkText.split("\n").filter((n) => n.trim()).length })}
                </Button>
              </motion.div>
            )}

            {inputMode === "csv" && (
              <motion.div
                key="csv"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center gap-2 hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{t("upload_csv_label")}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{participants.length} participantes</span>
            {participants.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearParticipants}
                className="text-destructive hover:text-destructive h-7 text-xs px-2"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                {t("clear")}
              </Button>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DuplicateModal />
      <div className="space-y-6">
        {/* Input mode tabs */}
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
          {[
            { mode: "single" as InputMode, label: t("input_mode.single"), icon: Plus },
            { mode: "bulk" as InputMode, label: t("input_mode.bulk"), icon: Copy },
            { mode: "csv" as InputMode, label: t("input_mode.csv"), icon: FileSpreadsheet },
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setInputMode(mode)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${inputMode === mode
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
                }`}
              style={inputMode === mode ? { backgroundColor: theme.primaryColor } : {}}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Input forms */}
        <AnimatePresence mode="wait">
          {inputMode === "single" && (
            <motion.div
              key="single"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-2"
            >
              <Input
                placeholder={t("single_placeholder")}
                value={singleName}
                onChange={(e) => setSingleName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSingle()}
                className="flex-1 bg-card border-border"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleAddSingle}
                    style={{ backgroundColor: theme.primaryColor }}
                    className="text-primary-foreground"
                    aria-label={t("add_participants_button", { count: 1 })}
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("add_participants_button", { count: 1 })}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          )}

          {inputMode === "bulk" && (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handlePaste} className="gap-2">
                  <Copy className="w-4 h-4" />
                  Pegar del portapapeles
                </Button>
              </div>
              <Textarea
                placeholder={t("bulk_placeholder")}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="min-h-[150px] bg-card border-border font-mono text-sm"
              />
              <Button
                onClick={handleAddBulk}
                style={{ backgroundColor: theme.primaryColor }}
                className="w-full text-primary-foreground"
              >
                {t("add_participants_button", { count: bulkText.split("\n").filter((n) => n.trim()).length })}
              </Button>
            </motion.div>
          )}

          {inputMode === "csv" && (
            <motion.div
              key="csv"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.txt" onChange={handleCSVUpload} className="hidden" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center gap-3 hover:border-primary/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t("csv_drop_label")}</span>
                <span className="text-xs text-muted-foreground/70">
                  {t("csv_help_text")}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Participants list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("participants_count", { count: participants.length })}
            </span>
            {participants.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearParticipants}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t("clear_all")}
              </Button>
            )}
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t("no_participants")}</p>
              <p className="text-xs mt-1">{t("no_participants_sub")}</p>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.02 }}
                    className="group flex items-center gap-3 p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <span
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium"
                      style={{ color: theme.primaryColor, backgroundColor: `${theme.primaryColor}20` }}
                    >
                      {index + 1}
                    </span>

                    {editingId === participant.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <Input
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit()
                            if (e.key === "Escape") cancelEdit()
                          }}
                          autoFocus
                          className="flex-1 h-8 bg-background"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={saveEdit}
                          className="h-8 w-8 text-green-500 hover:text-green-600"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span
                          className="flex-1 truncate cursor-pointer hover:underline decoration-dotted underline-offset-4"
                          onClick={() => startEditing(participant.id, participant.name)}
                          title={t("edit_tooltip")}
                        >
                          {participant.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => startEditing(participant.id, participant.name)}
                                className="p-1.5 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                                aria-label={t("edit_action")}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("edit_action")}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => removeParticipant(participant.id)}
                                className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                aria-label={t("delete_action")}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("delete_action")}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
