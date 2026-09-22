/**
 * Fixture data for the EdTech suite. One term at a mid-size school — every
 * school, learner, teacher and curriculum item is fictional.
 */

export const school = {
  name: 'Northgate Academy',
  kind: 'Secondary · 11–16 · 380 learners',
  term: 'Autumn term 2026',
  teacher: 'Ms Adeyemi',
  cohort: 'Year 9',
  learners: 380,
  parents: 240,
};

/* ---------------------------------------------------------------------- */
/* Step 1 — Assessor                                                       */

export const unit = {
  title: 'Year 9 Biology — Cell Structure & Transport',
  code: 'B9.2',
  framework: 'National Curriculum KS3 · Science',
  lessons: 6,
  target: 'Medium · stretch on transport',
};

/** Learning objectives, as written in the scheme of work. */
export const objectives = [
  {
    id: 'O1',
    text: 'The functions of the cell wall, cell membrane, cytoplasm, nucleus, vacuole, mitochondria and chloroplasts.',
  },
  {
    id: 'O2',
    text: 'The similarities and differences between plant and animal cells, and how to observe and record cell structure using a light microscope.',
  },
  {
    id: 'O3',
    text: 'The role of diffusion and osmosis in the movement of materials in and between cells.',
  },
];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DraftItem {
  n: number;
  kind: 'mcq' | 'short' | 'rubric';
  stem: string;
  objective: string;
  difficulty: Difficulty;
}

/** The draft, in the order it is written: eight MCQ, two short answer, one rubric. */
export const draft: DraftItem[] = [
  { n: 1, kind: 'mcq', stem: 'Which organelle controls the activities of the cell?', objective: 'O1', difficulty: 'easy' },
  { n: 2, kind: 'mcq', stem: 'Where in a plant cell does photosynthesis take place?', objective: 'O1', difficulty: 'easy' },
  { n: 3, kind: 'mcq', stem: 'Which structure is found in plant cells but not animal cells?', objective: 'O2', difficulty: 'easy' },
  { n: 4, kind: 'mcq', stem: 'What is the function of mitochondria?', objective: 'O1', difficulty: 'medium' },
  { n: 5, kind: 'mcq', stem: 'A cell is viewed at ×400. The eyepiece is ×10. What is the objective lens?', objective: 'O2', difficulty: 'medium' },
  { n: 6, kind: 'mcq', stem: 'Diffusion is the movement of particles from…', objective: 'O3', difficulty: 'medium' },
  { n: 7, kind: 'mcq', stem: 'Why does a plant cell in pure water not burst?', objective: 'O3', difficulty: 'hard' },
  { n: 8, kind: 'mcq', stem: 'Which factor does NOT affect the rate of diffusion?', objective: 'O3', difficulty: 'medium' },
  { n: 9, kind: 'short', stem: 'Explain why a red blood cell placed in pure water bursts, but a plant cell does not. (4 marks)', objective: 'O3', difficulty: 'hard' },
  { n: 10, kind: 'short', stem: 'Describe how you would prepare an onion cell slide and what you would expect to see. (4 marks)', objective: 'O2', difficulty: 'medium' },
];

/** Four-point rubric for the short-answer questions. */
export const rubric = [
  { point: 1, label: 'Scientific understanding', descriptor: 'Correct mechanism named and explained' },
  { point: 2, label: 'Use of terminology', descriptor: 'Osmosis, membrane, cell wall used accurately' },
  { point: 3, label: 'Application', descriptor: 'Links structure to the observed outcome' },
  { point: 4, label: 'Communication', descriptor: 'Clear, ordered, complete answer' },
];

export const difficultyTarget: Record<Difficulty, number> = { easy: 3, medium: 5, hard: 2 };

export const assessorTotals = {
  alignment: 'aligned to National Curriculum KS3 · 3 objectives · 10 questions · 1 rubric',
  status: 'Draft ready · awaiting teacher approval',
};

/* ---------------------------------------------------------------------- */
/* Step 2 — Marker                                                         */

export const submissions = {
  title: '47 learner responses — Unit quiz',
  count: 47,
  quiz: 'B9.2 Unit quiz · Cell Structure & Transport',
  received: '18 Oct 2026 · 16:05',
  rubric: 'Rubric R-B9.2 · 4 points',
};

export interface MarkedSample {
  learner: string;
  score: number;
  outOf: number;
  feedback: string;
  rubric: string;
}

export const markedSamples: MarkedSample[] = [
  {
    learner: 'A. Okafor',
    score: 9,
    outOf: 10,
    feedback: 'Strong on cell structure. In Q9, name osmosis explicitly — you described it without using the term.',
    rubric: 'R2 · Use of terminology',
  },
  {
    learner: 'L. Brennan',
    score: 6,
    outOf: 10,
    feedback: 'Q4–Q6 correct. Q9: you explained why the plant cell survives, but not why the red blood cell bursts — revisit lesson 4.',
    rubric: 'R1 · Scientific understanding',
  },
  {
    learner: 'S. Patel',
    score: 8,
    outOf: 10,
    feedback: 'Clear method in Q10. Add the iodine stain step and say what it does — that is the mark you missed.',
    rubric: 'R3 · Application',
  },
];

export const flagged = {
  count: 3,
  shown: {
    learner: 'M. Haddad',
    question: 'Q7',
    reason: 'Borderline on Q7 — interpretation of transport mechanism',
    detail: 'Answer describes active transport, not osmosis. Defensible reading of the stem; the teacher decides.',
  },
};

export const markerTotals = {
  status: '47 marked · 3 flagged for teacher review · feedback ready',
  turnaround: { before: '3 weeks', after: '2 days' },
};

/* ---------------------------------------------------------------------- */
/* Step 3 — Mapper                                                         */

export const frameworks = ['National Curriculum KS3 — Science', 'CBC — Integrated Science', 'TVET — Applied Science'];

export interface Strand {
  name: string;
  total: number;
  covered: number;
}

/** Coverage per strand; sums to 84 objectives, 79 covered. */
export const strands: Strand[] = [
  { name: 'Biology', total: 23, covered: 22 },
  { name: 'Chemistry', total: 21, covered: 20 },
  { name: 'Physics', total: 22, covered: 21 },
  { name: 'Working scientifically', total: 18, covered: 16 },
];

export interface Gap {
  objective: string;
  strand: string;
  state: 'no-assessment' | 'not-taught';
  note: string;
}

export const gaps: Gap[] = [
  { objective: 'Cell differentiation', strand: 'Biology', state: 'no-assessment', note: 'not yet assessed' },
  { objective: 'Transport mechanisms', strand: 'Biology', state: 'no-assessment', note: 'content exists, no assessment' },
  { objective: 'Energy changes in reactions', strand: 'Chemistry', state: 'not-taught', note: 'not yet taught' },
  { objective: 'Sound waves', strand: 'Physics', state: 'no-assessment', note: 'content exists, no assessment' },
];

export const pending = { objective: 'Space physics', note: 'scheduled · spring term' };

export const mapperTotals = {
  objectives: 84,
  covered: 79,
  gaps: 4,
  pending: 1,
  percent: 94,
  status: '84 objectives · 79 covered · 4 gaps · 1 pending',
};

/* ---------------------------------------------------------------------- */
/* Step 4 — Signal                                                         */

export const cohort = {
  title: 'Year 9 — 380 learners',
  learners: 380,
  weeks: 12,
  flagWeek: 9,
};

/** Weekly engagement across the term: the cohort, and the twelve who drift. */
export const termSeries = {
  labels: ['Wk 1', 'Wk 4', 'Wk 8', 'Wk 12'],
  cohort: [88, 87, 86, 85, 84, 84, 83, 82, 82, 81, 80, 80],
  drifting: [84, 80, 76, 70, 66, 60, 55, 52, 50, 47, 46, 44],
};

export type DriftReason = 'engagement' | 'missed' | 'performance';

export interface Drifter {
  learner: string;
  reason: DriftReason;
  detail: string;
  /** Engagement last month → this month; rolls down on screen. */
  from: number;
  to: number;
  action: string;
}

export const drifters: Drifter[] = [
  { learner: 'J. Mwangi', reason: 'engagement', detail: 'engagement down 40% this month', from: 82, to: 49, action: 'Teacher check-in' },
  { learner: 'R. Kowalski', reason: 'missed', detail: '2 missed assignments', from: 76, to: 61, action: 'Teacher check-in' },
  { learner: 'T. Nakamura', reason: 'performance', detail: 'performance slipping in last 3 assessments', from: 71, to: 58, action: 'Extra practice set' },
  { learner: 'D. Osei', reason: 'engagement', detail: 'engagement down 35% this month', from: 79, to: 51, action: 'Parent contact' },
  { learner: 'H. Fischer', reason: 'missed', detail: '2 missed assignments', from: 68, to: 54, action: 'Teacher check-in' },
  { learner: 'P. Almeida', reason: 'performance', detail: 'performance slipping in last 3 assessments', from: 74, to: 60, action: 'Extra practice set' },
  { learner: 'N. Chen', reason: 'engagement', detail: 'no logins for 9 days', from: 85, to: 42, action: 'Parent contact' },
  { learner: 'E. Dubois', reason: 'missed', detail: '3 missed assignments', from: 70, to: 47, action: 'Teacher check-in' },
  { learner: 'K. Abara', reason: 'performance', detail: 'performance slipping in last 3 assessments', from: 66, to: 55, action: 'Extra practice set' },
  { learner: 'B. Santos', reason: 'engagement', detail: 'engagement down 30% this month', from: 77, to: 56, action: 'Peer study pair' },
  { learner: 'W. Hughes', reason: 'missed', detail: '2 missed assignments', from: 72, to: 59, action: 'Peer study pair' },
  { learner: 'I. Petrova', reason: 'engagement', detail: 'engagement down 45% this month', from: 80, to: 44, action: 'Reduced load · pastoral' },
];

export interface Intervention {
  action: string;
  who: string;
  when: string;
}

export const interventions: Intervention[] = [
  { action: 'Teacher check-in', who: '4 learners', when: 'this week' },
  { action: 'Extra practice set', who: '3 learners · osmosis & diffusion', when: 'set today' },
  { action: 'Parent contact', who: '2 learners', when: 'before Friday' },
  { action: 'Peer study pair', who: '2 learners', when: 'from Monday' },
  { action: 'Reduced load · pastoral', who: '1 learner', when: 'review with head of year' },
];

export const signalTotals = {
  status: '380 tracked · 12 flagged · 5 interventions suggested',
  note: 'Signal is a signal, not a spreadsheet — it tells you who, when, and why.',
};

/* ---------------------------------------------------------------------- */
/* Step 5 — Tutor                                                          */

export const tutorScope = {
  course: 'Unit B9.2 · Cell Structure & Transport',
  lessons: 'Lessons 1–6 · slides, worksheets, the textbook chapter',
  teacher: school.teacher,
};

export const tutorThread = {
  question: "I don't understand why water moves differently in plant cells vs animal cells.",
  learner: 'L. Brennan',
  answer: [
    'Water moves into both by osmosis — from where there is more water to where there is less, across the cell membrane.',
    'The difference is what happens next. An animal cell has only a membrane, so if too much water comes in it swells and can burst.',
    'A plant cell has a cell wall outside the membrane. The wall pushes back, so the cell becomes firm (turgid) instead of bursting — that is the diagram from lesson 4.',
  ],
  source: 'Lesson 4 — Osmosis in plant cells · slide 7 and the diagram on worksheet 4B',
  offer: 'Would you like to try a similar question?',
  example: 'A potato chip is left in salt water for an hour. Predict what happens to its mass and explain why.',
};

export const escalation = {
  question: 'Can you explain how kidney dialysis machines use osmosis?',
  learner: 'L. Brennan',
  response: 'This is outside the course material. Escalating to your teacher.',
  note: `Passed to ${school.teacher} with the question and the lesson context. No answer was guessed.`,
};

export const tutorTotals = {
  status: 'Answered within course · 1 escalated to teacher · no open questions',
};

/* ---------------------------------------------------------------------- */
/* Step 6 — Registrar                                                      */

export const queue = {
  items: 240,
  window: 'Sends Monday 07:30 · parent portal + email',
};

export interface Category {
  name: string;
  recipients: number;
  detail: string;
}

export const categories: Category[] = [
  { name: 'Term reminder', recipients: 380, detail: 'Key dates, parents’ evening, half-term' },
  { name: 'Unit assessment schedule', recipients: 380, detail: 'B9.2 quiz week and what to revise' },
  { name: 'Individual follow-ups', recipients: 12, detail: 'Drifting learners from Signal' },
  { name: 'Welcome messages', recipients: 6, detail: 'New students joining this term' },
];

/** One message, before and after: the bare template, then the school's voice. */
export const message = {
  to: 'Parent or carer of Leo Brennan · Year 9',
  subject: 'Year 9 Biology — unit quiz next week',
  template: [
    'Notification: Assessment scheduled.',
    'Subject: Biology. Unit: B9.2. Date: Tuesday 27 October, period 3.',
    'Students should revise the unit material. Feedback will be provided after marking.',
    'Contact the school with any questions.',
  ],
  voice: [
    'Hello,',
    'A quick note from Northgate: Leo’s Year 9 Biology class has a short unit quiz next Tuesday (27 October, period 3). It covers cell structure and how water moves in and out of cells — the work from the last six lessons.',
    'The best preparation is the lesson 4 worksheet and the revision sheet Ms Adeyemi handed out. Twenty minutes is plenty. Leo will get written feedback within a few days of the quiz.',
    'If anything is unclear, just reply to this message and we’ll come back to you.',
    'Best wishes,\nNorthgate Academy',
  ],
  signoff: 'Same voice for all 240 · plain English · reading age 11',
};

export const registrarTotals = {
  status: '240 queued · in institution’s voice · send schedule set',
};
