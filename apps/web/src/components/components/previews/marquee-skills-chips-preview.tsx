/**
 * Live preview for `marquee-skills-chips`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
const SKILLS_KEYFRAMES = `
  @keyframes marquee-skills-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_SKILLS = ['TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Tailwind', 'Figma', 'Redis'];

const CHIP = 'inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-gray-100 px-3.5 py-1.5 text-sm font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200';

interface MarqueeSkillsChipsProps {
  skills?: string[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeSkillsChips({ skills = DEFAULT_SKILLS, durationSeconds = 34, className = '' }: MarqueeSkillsChipsProps) {
  const group = (hidden: boolean) => (
    <ul className={hidden ? 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:hidden' : 'flex shrink-0 items-center gap-2.5 pr-2.5 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-2.5 motion-reduce:pr-0'} aria-hidden={hidden || undefined}>
      {skills.map((skill) => (
        <li key={skill} className={CHIP}>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" />
          {skill}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={`w-full overflow-hidden py-6 ${className}`} aria-label="Skills">
      <style>{SKILLS_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-skills-scroll_34s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeSkillsChipsPreview() {
  return <MarqueeSkillsChips />;
}
