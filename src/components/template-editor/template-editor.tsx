import { useState, useRef, useCallback, useEffect } from 'react'
import { Button } from '../button'
import { TabBar } from '../tab-bar'
import { VariableChip, TEMPLATE_VARIABLES, type TemplateVariable } from '../variable-chip'
import styles from './template-editor.module.css'

/* ── Types ── */

export type TemplateNode =
  | { readonly type: 'text'; readonly content: string }
  | { readonly type: 'variable'; readonly key: string }

export interface LocaleTemplate {
  readonly subject: string
  readonly body: ReadonlyArray<TemplateNode>
}

export interface TemplateEditorProps {
  readonly templateId: string
  readonly templateName: string
  readonly locales: ReadonlyArray<string>
  readonly value: Readonly<Record<string, LocaleTemplate>>
  readonly onChange: (locale: string, template: LocaleTemplate) => void
  readonly onSave: (value: Record<string, LocaleTemplate>) => Promise<void>
  readonly isDirty: boolean
  readonly className?: string
}

/* ── Helpers ── */

const ALL_VARS: TemplateVariable[] = TEMPLATE_VARIABLES.flatMap((g) => g.variables)

const EXAMPLE_VALUES: Record<string, string> = {
  'player.name': 'Thomas Huber', 'player.email': 't.huber@example.de', 'player.id': 'usr_1a4d',
  'kyc.status': 'Approved', 'kyc.verified_at': '11 Apr 2026', 'kyc.document_type': 'Passport',
  'account.balance': '\u20ac420.00', 'account.currency': 'EUR', 'account.created_at': 'Apr 2024',
  'brand.name': 'Pferdewetten', 'brand.support_email': 'support@pferdewetten.de',
  'exclusion.reference': 'OASIS-DE-882211', 'exclusion.expires_at': '11 Apr 2027',
  'limit.amount': '\u20ac1,000', 'limit.period': 'monthly',
}

function nodesToText(nodes: ReadonlyArray<TemplateNode>): string {
  return nodes.map((n) => n.type === 'text' ? n.content : `{{${n.key}}}`).join('')
}

function textToNodes(text: string): TemplateNode[] {
  const parts = text.split(/(\{\{[^}]+\}\})/)
  return parts.filter(Boolean).map((p) => {
    const match = /^\{\{(.+)\}\}$/.exec(p)
    if (match?.[1] !== undefined) return { type: 'variable' as const, key: match[1] }
    return { type: 'text' as const, content: p }
  })
}

function renderPreview(nodes: ReadonlyArray<TemplateNode>): string {
  return nodes.map((n) => n.type === 'text' ? n.content : (EXAMPLE_VALUES[n.key] ?? `{{${n.key}}}`)).join('')
}

/* ── Component ── */

export function TemplateEditor({ templateName, locales, value, onChange, onSave, isDirty, className }: TemplateEditorProps) {
  const [activeLocale, setActiveLocale] = useState(locales[0] ?? 'en-GB')
  const [saving, setSaving] = useState(false)
  const [paletteSearch, setPaletteSearch] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const [acOpen, setAcOpen] = useState(false)
  const [acFilter, setAcFilter] = useState('')
  const [acIndex, setAcIndex] = useState(0)
  const [acPos, setAcPos] = useState({ top: 0, left: 0 })
  const editorRef = useRef<HTMLDivElement>(null)
  const acTriggerRef = useRef<string>('')

  const currentTemplate = value[activeLocale]
  const hasContent = currentTemplate !== undefined && (currentTemplate.subject !== '' || currentTemplate.body.length > 0)

  const localeTabs = locales.map((l) => ({ value: l, label: l }))

  /* ── Editor → Nodes sync ── */

  const parseEditorDOM = useCallback((): TemplateNode[] => {
    const el = editorRef.current
    if (el === null) return []
    const nodes: TemplateNode[] = []
    for (const child of Array.from(el.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.textContent) nodes.push({ type: 'text', content: child.textContent })
      } else if (child instanceof HTMLElement && child.dataset['variableKey'] !== undefined) {
        nodes.push({ type: 'variable', key: child.dataset['variableKey'] })
      } else if (child instanceof HTMLElement) {
        if (child.textContent) nodes.push({ type: 'text', content: child.textContent })
      }
    }
    return nodes
  }, [])

  const handleInput = useCallback(() => {
    if (acOpen) return
    const text = editorRef.current?.textContent ?? ''
    // Check for {{ trigger
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      const textBefore = range.startContainer.textContent?.slice(0, range.startOffset) ?? ''
      const triggerMatch = /\{\{(\w*)$/.exec(textBefore)
      if (triggerMatch !== null) {
        acTriggerRef.current = triggerMatch[0]
        setAcFilter(triggerMatch[1] ?? '')
        setAcIndex(0)
        const rect = range.getBoundingClientRect()
        const editorRect = editorRef.current?.getBoundingClientRect()
        if (editorRect) {
          setAcPos({ top: rect.bottom - editorRect.top + 4, left: rect.left - editorRect.left })
        }
        setAcOpen(true)
        return
      }
    }
    setAcOpen(false)
    const nodes = parseEditorDOM()
    if (currentTemplate) onChange(activeLocale, { ...currentTemplate, body: nodes })
  }, [acOpen, activeLocale, currentTemplate, onChange, parseEditorDOM])

  /* ── Insert variable ── */

  const insertVariable = useCallback((key: string) => {
    const el = editorRef.current
    if (el === null) return

    // Remove {{ trigger text if present
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && acTriggerRef.current) {
      const range = sel.getRangeAt(0)
      const node = range.startContainer
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        const idx = node.textContent.lastIndexOf(acTriggerRef.current)
        if (idx >= 0) {
          node.textContent = node.textContent.slice(0, idx) + node.textContent.slice(idx + acTriggerRef.current.length)
        }
      }
    }

    // Create chip span
    const chip = document.createElement('span')
    chip.dataset['variableKey'] = key
    chip.contentEditable = 'false'
    chip.className = 'variable-chip-inserted'
    chip.textContent = `{{${key}}}`
    chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:9999px;background:color-mix(in srgb, var(--ub-color-primary) 10%, transparent);color:var(--ub-color-primary);font-family:var(--ub-font-mono);font-size:11px;font-weight:500;cursor:default;user-select:none;vertical-align:baseline;'

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.collapse(false)
      range.insertNode(chip)
      range.setStartAfter(chip)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      el.appendChild(chip)
    }

    // Add space after
    const space = document.createTextNode('\u00a0')
    chip.after(space)
    if (sel) {
      const r = document.createRange()
      r.setStartAfter(space)
      r.collapse(true)
      sel.removeAllRanges()
      sel.addRange(r)
    }

    setAcOpen(false)
    acTriggerRef.current = ''
    el.focus()

    const nodes = parseEditorDOM()
    if (currentTemplate) onChange(activeLocale, { ...currentTemplate, body: nodes })
  }, [activeLocale, currentTemplate, onChange, parseEditorDOM])

  /* ── Remove variable ── */

  const removeVariable = useCallback((key: string) => {
    if (currentTemplate === undefined) return
    onChange(activeLocale, {
      ...currentTemplate,
      body: currentTemplate.body.filter((n) => !(n.type === 'variable' && n.key === key)),
    })
  }, [activeLocale, currentTemplate, onChange])

  /* ── Paste handler ── */

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    const nodes = textToNodes(text)
    // Insert as text + chips
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      for (const node of nodes) {
        if (node.type === 'text') {
          range.insertNode(document.createTextNode(node.content))
          range.collapse(false)
        } else {
          const chip = document.createElement('span')
          chip.dataset['variableKey'] = node.key
          chip.contentEditable = 'false'
          chip.className = 'variable-chip-inserted'
          chip.textContent = `{{${node.key}}}`
          chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:9999px;background:color-mix(in srgb, var(--ub-color-primary) 10%, transparent);color:var(--ub-color-primary);font-family:var(--ub-font-mono);font-size:11px;font-weight:500;cursor:default;user-select:none;vertical-align:baseline;'
          range.insertNode(chip)
          range.setStartAfter(chip)
          range.collapse(true)
        }
      }
    }
    const parsed = parseEditorDOM()
    if (currentTemplate) onChange(activeLocale, { ...currentTemplate, body: parsed })
  }, [activeLocale, currentTemplate, onChange, parseEditorDOM])

  /* ── Autocomplete keyboard ── */

  const filteredVars = ALL_VARS.filter((v) => v.key.includes(acFilter.toLowerCase()))
  const visibleAc = filteredVars.slice(0, 6)

  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!acOpen) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setAcIndex((i) => Math.min(i + 1, visibleAc.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAcIndex((i) => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); if (visibleAc[acIndex]) insertVariable(visibleAc[acIndex].key) }
    else if (e.key === 'Escape') { e.preventDefault(); setAcOpen(false) }
  }, [acOpen, acIndex, visibleAc, insertVariable])

  /* ── Toolbar ── */

  const execCmd = (cmd: string) => { document.execCommand(cmd, false); editorRef.current?.focus() }

  /* ── Save ── */

  const handleSave = async () => { setSaving(true); await onSave({ ...value }); setSaving(false) }

  /* ── Sync editor DOM when locale changes ── */

  useEffect(() => {
    const el = editorRef.current
    if (el === null || currentTemplate === undefined) return
    el.innerHTML = ''
    for (const node of currentTemplate.body) {
      if (node.type === 'text') {
        el.appendChild(document.createTextNode(node.content))
      } else {
        const chip = document.createElement('span')
        chip.dataset['variableKey'] = node.key
        chip.contentEditable = 'false'
        chip.className = 'variable-chip-inserted'
        chip.textContent = `{{${node.key}}}`
        chip.style.cssText = 'display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:9999px;background:color-mix(in srgb, var(--ub-color-primary) 10%, transparent);color:var(--ub-color-primary);font-family:var(--ub-font-mono);font-size:11px;font-weight:500;cursor:default;user-select:none;vertical-align:baseline;'
        el.appendChild(chip)
      }
    }
  }, [activeLocale, currentTemplate])

  /* ── Palette filtering ── */

  const filteredGroups = TEMPLATE_VARIABLES.map((g) => ({
    ...g,
    variables: g.variables.filter((v) => paletteSearch === '' || v.key.includes(paletteSearch.toLowerCase()) || v.description.toLowerCase().includes(paletteSearch.toLowerCase())),
  })).filter((g) => g.variables.length > 0)

  const wrapperCls = [styles['wrapper'], className].filter(Boolean).join(' ')

  return (
    <div className={wrapperCls}>
      {/* Header */}
      <div className={styles['header']}>
        <div className={styles['headerLeft']}>
          <span className={styles['templateName']}>{templateName}</span>
          {isDirty && <><span className={styles['dirtyDot']} /><span className={styles['dirtyLabel']}>Unsaved changes</span></>}
        </div>
        <Button variant="primary" size="sm" disabled={!isDirty || saving} onClick={handleSave}>{saving ? 'Saving\u2026' : 'Save template'}</Button>
      </div>

      {/* Locale tabs */}
      <TabBar tabs={localeTabs} activeTab={activeLocale} onTabChange={setActiveLocale} flush bordered />

      {/* Editor area */}
      {!hasContent && currentTemplate === undefined ? (
        <div className={styles['emptyLocale']}>No content for this locale. Start typing to create.</div>
      ) : (
        <div className={styles['editorArea']}>
          {/* Left: editor */}
          <div className={styles['editorCol']}>
            <div className={styles['subjectRow']}>
              <span className={styles['subjectLabel']}>Subject:</span>
              <input className={styles['subjectInput']} value={currentTemplate?.subject ?? ''} onChange={(e) => { if (currentTemplate) onChange(activeLocale, { ...currentTemplate, subject: e.target.value }) }} />
            </div>
            <div className={styles['toolbar']}>
              <button type="button" className={styles['toolBtn']} onClick={() => execCmd('bold')}><b>B</b></button>
              <button type="button" className={styles['toolBtn']} onClick={() => execCmd('italic')}><i>I</i></button>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                ref={editorRef}
                className={styles['editorBox']}
                contentEditable
                suppressContentEditableWarning
                data-placeholder="Start typing your template\u2026 Use {{ to insert variables"
                onInput={handleInput}
                onKeyDown={handleEditorKeyDown}
                onPaste={handlePaste}
              />
              {acOpen && visibleAc.length > 0 && (
                <div className={styles['autocomplete']} style={{ top: acPos.top, left: acPos.left }}>
                  {visibleAc.map((v, i) => (
                    <div key={v.key} className={`${styles['acItem']} ${i === acIndex ? styles['acItemActive'] : ''}`} onMouseDown={(e) => { e.preventDefault(); insertVariable(v.key) }}>
                      <span className={styles['acKey']}>{v.key}</span>
                      <span className={styles['acDesc']}>{v.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: palette */}
          <div className={styles['paletteCol']}>
            <span className={styles['paletteTitle']}>Insert variable</span>
            <input className={styles['paletteSearch']} placeholder="Search variables\u2026" value={paletteSearch} onChange={(e) => setPaletteSearch(e.target.value)} />
            {filteredGroups.map((g) => (
              <div key={g.group} className={styles['paletteGroup']}>
                <div className={styles['groupHeader']}>{g.group}</div>
                <div className={styles['chipGrid']}>
                  {g.variables.map((v) => (
                    <VariableChip key={v.key} variableKey={v.key} description={v.description} mode="palette" onInsert={() => insertVariable(v.key)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {hasContent && (
        <div className={styles['previewPanel']}>
          <button type="button" className={styles['previewToggle']} onClick={() => setPreviewOpen((p) => !p)}>
            {previewOpen ? '\u25B4' : '\u25BE'} Preview
          </button>
          {previewOpen && currentTemplate !== undefined && (
            <div className={styles['previewContent']}>
              <div className={styles['previewSubject']}>{renderPreview(textToNodes(currentTemplate.subject))}</div>
              <div>{renderPreview(currentTemplate.body)}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
