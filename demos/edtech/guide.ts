import type { GuideScript } from '@/lib/types';

/**
 * Guide script, keyed by step id. The first cue of each step is the agent's
 * own line, verbatim from the brief; the cues after it point at the evidence
 * on screen. Each cue is narrated and held until the line has been said.
 */
export const guide: GuideScript = {
  assessor: [
    {
      on: 'step:assessor',
      after: 500,
      text: 'Assessor drafts quizzes, questions and rubrics aligned to your curriculum and difficulty targets — teachers review and approve before anything reaches a learner.',
      target: 'unit-card',
    },
    {
      at: 0,
      text: 'Eight multiple choice, two short answer and a four-point rubric — drafted against the three objectives, with the difficulty spread the teacher asked for.',
      target: 'draft-build',
      annotation: '10 questions',
    },
    {
      at: 0,
      text: 'Aligned to the National Curriculum before anyone sees it. Nothing reaches a learner until the teacher approves.',
      target: 'alignment',
      annotation: 'Draft ready',
    },
  ],

  marker: [
    {
      on: 'step:marker',
      after: 500,
      text: 'Marker provides first-pass marking and individual feedback against the rubric, cutting turnaround from weeks to days — while the teacher keeps the final say.',
      target: 'submissions',
    },
    {
      at: 0,
      text: 'Forty-seven responses, each scored against the rubric with feedback the learner can act on — and a link back to the criterion it came from.',
      target: 'marked-samples',
      annotation: 'Rubric-linked',
    },
    {
      at: 0,
      text: 'Three are borderline. Marker does not decide those — it flags them, and the teacher makes the call.',
      target: 'flagged',
      annotation: 'Teacher review',
    },
  ],

  mapper: [
    {
      on: 'step:mapper',
      after: 500,
      text: 'Mapper maps content and assessment against curriculum frameworks — CBC, National Curriculum, TVET — and shows coverage and gaps at a glance.',
      target: 'framework',
    },
    {
      at: 0,
      text: 'Eighty-four objectives in the framework. Seventy-nine are covered by content and assessment — ninety-four percent, visible in one ring.',
      target: 'coverage',
      annotation: '94% covered',
    },
    {
      at: 0,
      text: 'Four gaps, named. One has content but no assessment; one has neither. That is the planning list for next half-term.',
      target: 'gaps',
      annotation: '4 gaps',
    },
  ],

  signal: [
    {
      on: 'step:signal',
      after: 500,
      text: 'Signal watches engagement and performance data and flags learners who are drifting while there is still time to intervene — a signal, not a spreadsheet.',
      target: 'cohort',
    },
    {
      at: 0,
      text: 'Twelve learners are drifting — each with the reason: engagement down, assignments missed, or scores slipping across the last three assessments.',
      target: 'drift-list',
      annotation: '12 drifting',
    },
    {
      at: 0,
      text: 'And for each, a suggested next step: a check-in, a practice set, a call home. Who, when and why — nothing to sift.',
      target: 'interventions',
      annotation: '5 suggested',
    },
  ],

  tutor: [
    {
      on: 'step:tutor',
      after: 500,
      text: 'Tutor answers learner questions within the bounds of the course material, offers worked examples, and escalates to a teacher when it reaches its limits.',
      target: 'question',
    },
    {
      at: 0,
      text: 'The answer comes from the lesson the learner actually had — osmosis, cell walls, the diagram from lesson four — and offers a worked example to try.',
      target: 'answer',
      annotation: 'Within course',
    },
    {
      at: 0,
      text: 'The second question is outside the course. Tutor does not guess. It says so, and hands it to the teacher.',
      target: 'escalation',
      annotation: 'Escalated',
    },
  ],

  registrar: [
    {
      on: 'step:registrar',
      after: 500,
      text: 'Registrar handles routine parent and student communications, reminders, notices, follow-ups — consistently and in the institution\'s voice.',
      target: 'queue',
    },
    {
      at: 0,
      text: 'Two hundred and forty items in four categories — including twelve individual follow-ups for the learners Signal flagged.',
      target: 'categories',
      annotation: '4 categories',
    },
    {
      at: 0,
      text: 'Every message in the school\'s own voice: plain English, friendly, and the same for every parent. Nothing goes until the teacher approves.',
      target: 'message',
      annotation: 'One voice',
    },
  ],
};
