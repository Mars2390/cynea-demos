import type { Step } from '@/lib/types';

export const agent = {
  name: 'EdTech',
  role: 'EdTech suite · six agents',
  tagline: 'Teachers keep the judgement. Agents take the busywork.',
};

/**
 * One term at a mid-size school, told across six agents in the order the
 * work happens: the quiz is drafted, the submissions are marked, the
 * curriculum is mapped, the cohort is watched, a learner is tutored, and the
 * parents are told — every step with the teacher keeping the final say.
 */
export const steps: Step[] = [
  {
    number: 1,
    id: 'assessor',
    name: 'Assessor',
    role: 'Assessment Generation Agent',
    title: 'New unit. New quiz. Teacher defines the target, Assessor drafts.',
    why: 'Assessment creation is where teaching hours disappear. Assessor gives them back, with the curriculum alignment already done.',
    next: 'Mark the submissions →',
  },
  {
    number: 2,
    id: 'marker',
    name: 'Marker',
    role: 'Feedback & Marking Agent',
    title: '47 submissions. Marker does the first pass. Teacher keeps the final say.',
    why: 'Feedback is where learning happens. Marker makes sure it happens this week, not next month.',
    next: 'Map the curriculum →',
  },
  {
    number: 3,
    id: 'mapper',
    name: 'Mapper',
    role: 'Curriculum Mapping Agent',
    title: 'Framework selected. Content mapped. Coverage visible.',
    why: "You can't teach what you can't see. Mapper makes the whole curriculum visible.",
    next: 'Watch the cohort →',
  },
  {
    number: 4,
    id: 'signal',
    name: 'Signal',
    role: 'Learner Progress Agent',
    title: "380 learners. 12 drifting. Signal spots them before it's too late.",
    why: "By the time a learner fails, it's late. Signal finds them while there's still time.",
    next: 'Answer a question →',
  },
  {
    number: 5,
    id: 'tutor',
    name: 'Tutor',
    role: 'Study Support Agent',
    title: 'A learner asks a question. Tutor answers within bounds. Escalates at the edge.',
    why: 'A tutor that guesses is worse than no tutor. Tutor knows its bounds — and escalates at the edge.',
    next: 'Send the notices →',
  },
  {
    number: 6,
    id: 'registrar',
    name: 'Registrar',
    role: 'School Communications Agent',
    title: '240 parents. 240 notifications. One voice.',
    why: "School communications shouldn't depend on who has time. Registrar makes sure every parent hears the same clear voice, every time.",
    next: 'Finish →',
  },
];

/** Agent descriptions, verbatim from the brief, shown under each step title. */
export const descriptions: Record<string, string> = {
  assessor:
    'Drafts quizzes, questions, and rubrics aligned to your curriculum and difficulty targets, teachers review and approve before anything reaches a learner.',
  marker:
    'Provides first-pass marking and individual feedback against the rubric, cutting turnaround from weeks to days while the teacher keeps the final say.',
  mapper:
    'Maps content and assessment against curriculum frameworks, CBC, National Curriculum, TVET, and shows coverage and gaps at a glance.',
  signal:
    'Watches engagement and performance data and flags learners who are drifting while there is still time to intervene, a signal, not a spreadsheet.',
  tutor:
    'Answers learner questions within the bounds of the course material, offers worked examples, and escalates to a teacher when it reaches its limits.',
  registrar:
    "Handles routine parent and student communications, reminders, notices, follow-ups, consistently and in the institution's voice.",
};

/** Terminal state, reached at /edtech/ready. */
export const readyStep = {
  id: 'ready',
  heading: 'This is what teaching looks like on Cynea.',
  sub: 'Six agents. One term. Teachers keep the judgement.',
  bookLabel: 'Book a demo with Irene',
  bookHref: 'mailto:irene@cynea.ai',
  replayLabel: 'Replay the demo',
  trustPills: ['No credit card', '14-day free trial', 'Your own Gmail or Outlook'],
  disclaimer:
    'This was a demo. Every school, learner, teacher, and curriculum item you just saw was fictional. Nothing was submitted or sent.',
};

export const stepIds = steps.map((s) => s.id);
export const firstStepId = steps[0].id;
