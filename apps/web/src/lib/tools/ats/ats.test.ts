import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { analyzeResume } from './analyze';

/**
 * ATS scoring tests. The engine is pure over (resumeText, jobDescription), so a
 * strong and a weak resume are scored against the same posting and the concrete
 * signals (matched skills, missing skills, sections, suggestions) are pinned.
 */

const JD = `We are hiring a Senior Frontend Engineer. You will build with React, TypeScript
and Next.js, style with Tailwind, and ship accessible, performant interfaces. Experience with
testing, CI/CD and REST APIs required. Strong communication and leadership.`;

const STRONG = `Jane Doe
jane@example.com | +1 555 010 2040 | linkedin.com/in/jane
Summary
Senior frontend engineer with 8 years of experience.
Experience
Built React and Next.js apps in TypeScript, styled with Tailwind. Led accessibility and performance
work, set up CI/CD, wrote unit testing, integrated REST APIs. Mentored the team.
Skills
React, TypeScript, Next.js, Tailwind, testing, REST, CI/CD, accessibility, leadership, communication.
Education
BS Computer Science, State University.`;

const WEAK = `John Smith
Worked on some websites and did a few things with computers.
I am a hard worker and a team player.`;

describe('analyzeResume', () => {
  it('scores a strong, tailored resume high', () => {
    const r = analyzeResume(STRONG, JD);
    assert.ok(r.overall >= 75, `overall ${r.overall}`);
    assert.ok(r.matchedSkills.includes('react'));
    assert.ok(r.matchedSkills.includes('typescript'));
    assert.equal(r.sections.experience, true);
    assert.equal(r.sections.education, true);
    assert.equal(r.stats.hasEmail, true);
    assert.equal(r.stats.hasLinks, true);
  });

  it('scores a weak, generic resume low and suggests fixes', () => {
    const r = analyzeResume(WEAK, JD);
    assert.ok(r.overall < 55, `overall ${r.overall}`);
    assert.ok(r.missingSkills.includes('react'));
    assert.equal(r.sections.skills, false);
    assert.equal(r.stats.hasEmail, false);
    assert.ok(r.suggestions.some((s) => /email/i.test(s)));
    assert.ok(r.suggestions.some((s) => /skills/i.test(s)));
  });

  it('gives a neutral skills score when the JD lists no known skills', () => {
    const r = analyzeResume(STRONG, 'We want a friendly, motivated person to join a fun team.');
    assert.equal(r.breakdown.skills, 100); // nothing to match against
  });

  it('breakdown values stay within 0–100', () => {
    const r = analyzeResume(STRONG, JD);
    for (const v of Object.values(r.breakdown)) {
      assert.ok(v >= 0 && v <= 100, `value ${v}`);
    }
  });
});
