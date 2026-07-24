'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Eye, EyeOff, FileJson, GripVertical, ImagePlus, Plus, Printer, Trash2, Upload } from 'lucide-react';
import { Button, Input, Label, Select, cn } from 'adysre';
import type { CertItem, EducationItem, ExperienceItem, LinkItem, ProjectItem, ResumeData, ResumeSection } from '@/lib/tools/resume/types';
import { SAMPLE_RESUME } from '@/lib/tools/resume/sample';
import { RESUME_FONTS, RESUME_TEMPLATES } from '@/lib/tools/resume/templates';
import { fromJson, toJson } from '@/lib/tools/resume/serialize';
import { ResumePreview } from './resume-preview';

/**
 * Resume Builder. A live editor beside a print-ready preview: pick a template,
 * edit typed sections, and drag to reorder or hide sections (Framer Motion
 * Reorder). Autosaves to localStorage; exports print-to-PDF and JSON, imports
 * JSON. All client-side, no AI.
 */

const STORAGE_KEY = 'adysre:resume:v1';
let uid = 0;
const nid = (p: string) => `${p}-${(uid += 1)}-${Math.round(performance.now())}`;

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(SAMPLE_RESUME);
  const [saved, setSaved] = useState(false);
  const loaded = useRef(false);

  // Load once, then autosave.
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      const parsed = fromJson(stored);
      if (parsed) setData(parsed);
    }
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    window.localStorage.setItem(STORAGE_KEY, toJson(data));
    setSaved(true);
    const t = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(t);
  }, [data]);

  const set = (patch: Partial<ResumeData>) => setData((d) => ({ ...d, ...patch }));
  const setContact = (patch: Partial<ResumeData['contact']>) => setData((d) => ({ ...d, contact: { ...d.contact, ...patch } }));
  const setDesign = (patch: Partial<ResumeData['design']>) => setData((d) => ({ ...d, design: { ...d.design, ...patch } }));

  function toggleSection(id: string) {
    setData((d) => ({ ...d, sections: d.sections.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)) }));
  }

  function onPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set({ photo: typeof reader.result === 'string' ? reader.result : '' });
    reader.readAsDataURL(file);
  }
  function onImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    file.text().then((text) => {
      const parsed = fromJson(text);
      if (parsed) setData(parsed);
    });
  }

  // Array-section helpers
  const addExp = () => set({ experience: [...data.experience, { id: nid('e'), role: '', company: '', period: '', location: '', bullets: '' }] });
  const setExp = (id: string, patch: Partial<ExperienceItem>) => set({ experience: data.experience.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rmExp = (id: string) => set({ experience: data.experience.filter((x) => x.id !== id) });

  const addEdu = () => set({ education: [...data.education, { id: nid('ed'), degree: '', school: '', period: '', details: '' }] });
  const setEdu = (id: string, patch: Partial<EducationItem>) => set({ education: data.education.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rmEdu = (id: string) => set({ education: data.education.filter((x) => x.id !== id) });

  const addProj = () => set({ projects: [...data.projects, { id: nid('p'), name: '', url: '', description: '' }] });
  const setProj = (id: string, patch: Partial<ProjectItem>) => set({ projects: data.projects.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rmProj = (id: string) => set({ projects: data.projects.filter((x) => x.id !== id) });

  const addCert = () => set({ certifications: [...data.certifications, { id: nid('c'), name: '', issuer: '', year: '' }] });
  const setCert = (id: string, patch: Partial<CertItem>) => set({ certifications: data.certifications.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rmCert = (id: string) => set({ certifications: data.certifications.filter((x) => x.id !== id) });

  const addLink = () => set({ links: [...data.links, { id: nid('l'), label: '', url: '' }] });
  const setLink = (id: string, patch: Partial<LinkItem>) => set({ links: data.links.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  const rmLink = (id: string) => set({ links: data.links.filter((x) => x.id !== id) });

  return (
    <div className="grid gap-8 lg:grid-cols-[24rem_1fr]">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS(data.design.pageSize) }} />

      {/* Editor */}
      <div className="relative space-y-6">
        <Panel title="Template & design">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect label="Template" value={data.templateId} onChange={(v) => set({ templateId: v })}>
              {RESUME_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </FieldSelect>
            <FieldSelect label="Font" value={data.design.font} onChange={(v) => setDesign({ font: v })}>
              {RESUME_FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </FieldSelect>
            <div className="space-y-1.5">
              <Label>Accent</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={data.design.accent} onChange={(e) => setDesign({ accent: e.target.value })} className="h-9 w-10 shrink-0 cursor-pointer rounded-md border border-input bg-background" aria-label="Accent" />
                <Input value={data.design.accent} onChange={(e) => setDesign({ accent: e.target.value })} className="font-mono" />
              </div>
            </div>
            <FieldSelect label="Page size" value={data.design.pageSize} onChange={(v) => setDesign({ pageSize: v as ResumeData['design']['pageSize'] })}>
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
            </FieldSelect>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <ImagePlus className="h-4 w-4" aria-hidden /> {data.photo ? 'Replace photo' : 'Photo'}
              <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
            </label>
            {data.photo && <Button type="button" variant="outline" size="sm" onClick={() => set({ photo: '' })}><Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Remove</Button>}
          </div>
        </Panel>

        <Panel title="Contact">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name" value={data.contact.name} onChange={(v) => setContact({ name: v })} className="col-span-2" />
            <Field label="Headline" value={data.contact.headline} onChange={(v) => setContact({ headline: v })} className="col-span-2" />
            <Field label="Email" value={data.contact.email} onChange={(v) => setContact({ email: v })} />
            <Field label="Phone" value={data.contact.phone} onChange={(v) => setContact({ phone: v })} />
            <Field label="Location" value={data.contact.location} onChange={(v) => setContact({ location: v })} />
            <Field label="Website" value={data.contact.website} onChange={(v) => setContact({ website: v })} />
          </div>
        </Panel>

        <Panel title="Sections (drag to reorder)">
          <Reorder.Group axis="y" values={data.sections} onReorder={(next: ResumeSection[]) => set({ sections: next })} className="space-y-2">
            {data.sections.map((section) => (
              <SectionRow key={section.id} section={section} onToggle={() => toggleSection(section.id)} />
            ))}
          </Reorder.Group>
        </Panel>

        <Panel title="Summary">
          <FieldArea value={data.summary} onChange={(v) => set({ summary: v })} rows={3} />
        </Panel>

        <Panel title="Skills">
          <FieldArea value={data.skills.join(', ')} onChange={(v) => set({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })} rows={2} placeholder="Comma separated" />
        </Panel>

        <ListPanel title="Experience" onAdd={addExp}>
          {data.experience.map((e) => (
            <ItemCard key={e.id} onRemove={() => rmExp(e.id)}>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Role" value={e.role} onChange={(v) => setExp(e.id, { role: v })} />
                <Field label="Company" value={e.company} onChange={(v) => setExp(e.id, { company: v })} />
                <Field label="Period" value={e.period} onChange={(v) => setExp(e.id, { period: v })} />
                <Field label="Location" value={e.location} onChange={(v) => setExp(e.id, { location: v })} />
              </div>
              <FieldArea label="Bullets (one per line)" value={e.bullets} onChange={(v) => setExp(e.id, { bullets: v })} rows={3} />
            </ItemCard>
          ))}
        </ListPanel>

        <ListPanel title="Projects" onAdd={addProj}>
          {data.projects.map((p) => (
            <ItemCard key={p.id} onRemove={() => rmProj(p.id)}>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Name" value={p.name} onChange={(v) => setProj(p.id, { name: v })} />
                <Field label="URL" value={p.url} onChange={(v) => setProj(p.id, { url: v })} />
              </div>
              <FieldArea label="Description" value={p.description} onChange={(v) => setProj(p.id, { description: v })} rows={2} />
            </ItemCard>
          ))}
        </ListPanel>

        <ListPanel title="Education" onAdd={addEdu}>
          {data.education.map((e) => (
            <ItemCard key={e.id} onRemove={() => rmEdu(e.id)}>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Degree" value={e.degree} onChange={(v) => setEdu(e.id, { degree: v })} />
                <Field label="School" value={e.school} onChange={(v) => setEdu(e.id, { school: v })} />
                <Field label="Period" value={e.period} onChange={(v) => setEdu(e.id, { period: v })} />
              </div>
            </ItemCard>
          ))}
        </ListPanel>

        <ListPanel title="Certifications" onAdd={addCert}>
          {data.certifications.map((c) => (
            <ItemCard key={c.id} onRemove={() => rmCert(c.id)}>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Name" value={c.name} onChange={(v) => setCert(c.id, { name: v })} />
                <Field label="Issuer" value={c.issuer} onChange={(v) => setCert(c.id, { issuer: v })} />
                <Field label="Year" value={c.year} onChange={(v) => setCert(c.id, { year: v })} />
              </div>
            </ItemCard>
          ))}
        </ListPanel>

        <ListPanel title="Links" onAdd={addLink}>
          {data.links.map((l) => (
            <ItemCard key={l.id} onRemove={() => rmLink(l.id)}>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Label" value={l.label} onChange={(v) => setLink(l.id, { label: v })} />
                <Field label="URL" value={l.url} onChange={(v) => setLink(l.id, { url: v })} />
              </div>
            </ItemCard>
          ))}
        </ListPanel>
      </div>

      {/* Preview + actions */}
      <div className="relative space-y-4 lg:sticky lg:top-4 lg:self-start">
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={() => window.print()}><Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Print / PDF</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => download(`resume-${data.contact.name || 'me'}.json`.replace(/\s+/g, '-'), toJson(data), 'application/json')}>
            <FileJson className="mr-1.5 h-3.5 w-3.5" aria-hidden /> JSON
          </Button>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Upload className="h-3.5 w-3.5" aria-hidden /> Import
            <input type="file" accept=".json,application/json" className="sr-only" onChange={onImport} />
          </label>
          <span className="ml-auto text-xs text-muted-foreground">{saved ? 'Saved' : 'Autosaves locally'}</span>
        </div>
        <div id="resume-print" className="overflow-hidden rounded-2xl border border-border shadow-sm">
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}

function SectionRow({ section, onToggle }: { section: ResumeSection; onToggle: () => void }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={section} dragListener={false} dragControls={controls} className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <button type="button" onPointerDown={(e) => controls.start(e)} className="cursor-grab text-muted-foreground active:cursor-grabbing" aria-label="Drag to reorder">
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>
      <span className={cn('flex-1 text-sm', !section.visible && 'text-muted-foreground line-through')}>{section.title}</span>
      <button type="button" onClick={onToggle} aria-label={section.visible ? 'Hide' : 'Show'} className="text-muted-foreground transition-colors hover:text-foreground">
        {section.visible ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
      </button>
    </Reorder.Item>
  );
}

const PRINT_CSS = (size: string) => `@page { size: ${size} portrait; margin: 12mm; }
@media print {
  body * { visibility: hidden !important; }
  #resume-print, #resume-print * { visibility: visible !important; }
  #resume-print { position: absolute; left: 0; top: 0; width: 100%; border: 0 !important; box-shadow: none !important; }
}`;

// ── Primitives ───────────────────────────────────────────────────────────────

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-3 rounded-2xl border border-border bg-card p-5"><h2 className="text-sm font-semibold">{title}</h2>{children}</section>;
}
function ListPanel({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <Panel title={title}>
      <div className="space-y-3">{children}</div>
      <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onAdd}><Plus className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Add</Button>
    </Panel>
  );
}
function ItemCard({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-border p-3">
      {children}
      <Button type="button" variant="outline" size="sm" onClick={onRemove}><Trash2 className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Remove</Button>
    </div>
  );
}
function Field({ label, value, onChange, className }: { label?: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <div className={className ? `${className} space-y-1.5` : 'space-y-1.5'}>
      {label && <Label>{label}</Label>}
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function FieldArea({ label, value, onChange, rows = 3, placeholder }: { label?: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
    </div>
  );
}
function FieldSelect({ label, value, onChange, children }: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label><Select value={value} onChange={(e) => onChange(e.target.value)}>{children}</Select></div>;
}
