'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { AlertCircle, CheckCircle2, FileJson, Loader2, Printer, Upload, XCircle } from 'lucide-react';
import { Button, cn } from 'adysre';
import { analyzeResume, RESUME_SECTIONS, type AtsBreakdown, type AtsReport, type SectionId } from '@/lib/tools/ats/analyze';
import { extractResumeText, isSupportedResume } from '@/lib/tools/ats/extract';

/**
 * ATS Resume Scanner. Upload a PDF/DOCX/TXT (or paste the text), add the job
 * description, and get a rule-based ATS score with the keyword/skill/section
 * breakdown and concrete fixes — all in the browser, no AI, no upload to a
 * server. The scoring is the pure `analyzeResume`; this component wires the
 * extraction and renders the report live.
 */

const BREAKDOWN_LABELS: Record<keyof AtsBreakdown, string> = {
  keywords: 'Keyword match',
  skills: 'Skills match',
  sections: 'Section completeness',
  formatting: 'Formatting',
  ats: 'ATS compliance',
};
const SECTION_LABELS: Record<SectionId, string> = {
  contact: 'Contact', summary: 'Summary', experience: 'Experience', projects: 'Projects', skills: 'Skills',
  education: 'Education', certifications: 'Certifications', languages: 'Languages', links: 'Links',
};

function tone(score: number): { text: string; bar: string } {
  if (score >= 80) return { text: 'text-success', bar: 'bg-success' };
  if (score >= 60) return { text: 'text-warning', bar: 'bg-warning' };
  return { text: 'text-destructive', bar: 'bg-destructive' };
}

function download(name: string, content: string, mime: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function AtsScanner() {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [jd, setJd] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const report = useMemo<AtsReport | null>(
    () => (resumeText.trim() && jd.trim() ? analyzeResume(resumeText, jd) : null),
    [resumeText, jd],
  );

  async function onUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!isSupportedResume(file)) {
      setError('Upload a PDF, DOCX or TXT file.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const text = await extractResumeText(file);
      setResumeText(text);
      setFileName(file.name);
    } catch {
      setError('Could not read that file. Try pasting the text instead.');
    } finally {
      setBusy(false);
    }
  }

  const overall = report ? tone(report.overall) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />

      {/* Inputs */}
      <div className="relative space-y-4">
        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Resume</h2>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Upload className="h-4 w-4" aria-hidden />}
              {fileName || 'Upload PDF / DOCX / TXT'}
              <input type="file" accept=".pdf,.docx,.txt" className="sr-only" onChange={onUpload} />
            </label>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={12}
            placeholder="…or paste your resume text here"
            className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Processed locally. Your resume never leaves this browser.</p>
        </section>

        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">Job description</h2>
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={10}
            placeholder="Paste the job posting here"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </section>
      </div>

      {/* Report */}
      <div className="relative space-y-4 lg:sticky lg:top-4 lg:self-start">
        {!report ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
            <AlertCircle className="h-6 w-6" aria-hidden />
            <p className="px-8">Add your resume and a job description to see the ATS score.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => window.print()}>
                <Printer className="mr-1.5 h-3.5 w-3.5" aria-hidden /> Print / PDF
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => download('ats-report.json', JSON.stringify(report, null, 2), 'application/json')}>
                <FileJson className="mr-1.5 h-3.5 w-3.5" aria-hidden /> JSON
              </Button>
            </div>

            <div id="ats-report" className="space-y-5">
              {/* Score + breakdown */}
              <div className="grid gap-5 rounded-2xl border border-border bg-card p-6 sm:grid-cols-[auto_1fr] sm:items-center">
                <div className={cn('flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-border text-3xl font-bold tabular-nums', overall!.text)}>
                  {report.overall}
                </div>
                <div className="space-y-2.5">
                  {(Object.keys(BREAKDOWN_LABELS) as Array<keyof AtsBreakdown>).map((key) => {
                    const v = report.breakdown[key];
                    const t = tone(v);
                    return (
                      <div key={key}>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="text-muted-foreground">{BREAKDOWN_LABELS[key]}</span>
                          <span className={cn('font-semibold tabular-nums', t.text)}>{v}</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className={cn('h-full rounded-full', t.bar)} style={{ width: `${v}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills */}
              <div className="grid gap-4 sm:grid-cols-2">
                <ChipList title={`Matched skills (${report.matchedSkills.length})`} items={report.matchedSkills} tone="success" empty="No matching skills found." />
                <ChipList title={`Missing skills (${report.missingSkills.length})`} items={report.missingSkills} tone="destructive" empty="Nothing missing from the posting." />
              </div>

              {/* Sections */}
              <div>
                <h3 className="text-sm font-semibold">Sections detected</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {RESUME_SECTIONS.map((s) => (
                    <li key={s} className={cn('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs', report.sections[s] ? 'border-success/30 bg-success/10 text-success' : 'border-border bg-card text-muted-foreground')}>
                      {report.sections[s] ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <XCircle className="h-3.5 w-3.5" aria-hidden />}
                      {SECTION_LABELS[s]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              {report.suggestions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Suggestions</h3>
                  <ul className="mt-3 space-y-2">
                    {report.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warning" aria-hidden />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const PRINT_CSS = `@media print {
  body * { visibility: hidden !important; }
  #ats-report, #ats-report * { visibility: visible !important; }
  #ats-report { position: absolute; left: 0; top: 0; width: 100%; }
}`;

function ChipList({ title, items, tone, empty }: { title: string; items: string[]; tone: 'success' | 'destructive'; empty: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {items.map((s) => (
            <li key={s} className={cn('rounded-md border px-2 py-0.5 text-xs capitalize', tone === 'success' ? 'border-success/30 bg-success/10 text-success' : 'border-destructive/30 bg-destructive/10 text-destructive')}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
