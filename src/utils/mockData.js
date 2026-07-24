export const user = {
  id: 'user-1',
  name: 'Student',
  email: '',
  course: 'Your course',
  avatar: 'ST',
  streak: 18,
}

export const quotes = [
  'Clarity compounds faster than cramming.',
  'A focused hour beats a distracted afternoon.',
  'Small daily reviews build durable memory.',
]

export const landingFeatures = [
  {
    title: 'Capture fast',
    detail: 'Save class notes with markdown support, subject labels, and quick AI actions.',
  },
  {
    title: 'Recall better',
    detail: 'Turn notes into flashcards and quizzes without leaving the study workspace.',
  },
  {
    title: 'Plan clearly',
    detail: 'Track upcoming tasks, priorities, and study streaks from one dashboard.',
  },
]

export const notes = [
  {
    id: 'note-1',
    title: 'Machine Learning Revision',
    subject: 'AI',
    preview: 'Bias-variance tradeoff, evaluation metrics, and feature scaling strategies.',
    content: `# Machine Learning Revision

## Core ideas
- Bias and variance move in opposite directions.
- Precision and recall matter more than raw accuracy on imbalanced data.
- Feature scaling stabilizes distance-based and gradient-based models.

## Quick recap
Use train, validation, and test splits carefully. Evaluate models with confusion matrices and choose metrics that fit the problem.`,
    lastEdited: '2026-07-20T18:15:00.000Z',
    favorite: true,
  },
  {
    id: 'note-2',
    title: 'Database Normalization Cheatsheet',
    subject: 'DBMS',
    preview: '1NF to BCNF with examples and decomposition rules.',
    content: `# DBMS Normalization

## Forms
1. 1NF removes repeating groups
2. 2NF removes partial dependency
3. 3NF removes transitive dependency
4. BCNF ensures every determinant is a candidate key`,
    lastEdited: '2026-07-19T11:40:00.000Z',
    favorite: false,
  },
  {
    id: 'note-3',
    title: 'Operating Systems Memory Notes',
    subject: 'OS',
    preview: 'Paging, segmentation, virtual memory, and page replacement policies.',
    content: `# OS Memory Notes

Virtual memory allows processes to use an address space larger than physical memory.

## Page replacement
- FIFO
- LRU
- Optimal`,
    lastEdited: '2026-07-18T15:12:00.000Z',
    favorite: false,
  },
  {
    id: 'note-4',
    title: 'Discrete Mathematics Formula Bank',
    subject: 'Math',
    preview: 'Graph theory formulas, recurrence relations, and combinatorics shortcuts.',
    content: `# Discrete Mathematics Formula Bank

## Reminders
- Sum of degrees = 2E
- Inclusion exclusion helps with overlapping sets
- Recurrence relations often simplify with substitution`,
    lastEdited: '2026-07-16T09:45:00.000Z',
    favorite: true,
  },
]

export const flashcardSets = [
  {
    id: 'set-1',
    subject: 'AI',
    title: 'Neural Networks Basics',
    createdDate: '2026-07-17T08:00:00.000Z',
    cards: [
      {
        question: 'What does an activation function do?',
        answer: 'It introduces non-linearity so the network can learn complex patterns.',
      },
      {
        question: 'What is backpropagation?',
        answer: 'A method to compute gradients for each weight using the chain rule.',
      },
      {
        question: 'Why use normalization?',
        answer: 'It stabilizes training and helps gradients flow more consistently.',
      },
    ],
  },
  {
    id: 'set-2',
    subject: 'DBMS',
    title: 'SQL and Indexing',
    createdDate: '2026-07-15T08:00:00.000Z',
    cards: [
      {
        question: 'What is a clustered index?',
        answer: 'It determines the physical order of rows in a table.',
      },
      {
        question: 'Why use an index?',
        answer: 'It speeds up reads at the cost of write overhead and storage.',
      },
      {
        question: 'What does JOIN do?',
        answer: 'It combines rows from multiple tables using a related column.',
      },
    ],
  },
  {
    id: 'set-3',
    subject: 'OS',
    title: 'CPU Scheduling',
    createdDate: '2026-07-13T08:00:00.000Z',
    cards: [
      {
        question: 'What is Round Robin scheduling?',
        answer: 'A preemptive scheduling algorithm that assigns a time quantum to each process.',
      },
      {
        question: 'What is turnaround time?',
        answer: 'The total time from process arrival to completion.',
      },
      {
        question: 'Why is starvation a concern?',
        answer: 'Low-priority processes may wait indefinitely in some schedulers.',
      },
    ],
  },
]

export const tasks = [
  {
    id: 'task-1',
    title: 'Finish DBMS assignment',
    priority: 'High',
    deadline: '2026-07-22T18:00:00.000Z',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Revise neural networks before quiz',
    priority: 'Medium',
    deadline: '2026-07-23T09:00:00.000Z',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Submit OS lab report',
    priority: 'High',
    deadline: '2026-07-21T20:30:00.000Z',
    completed: true,
  },
  {
    id: 'task-4',
    title: 'Plan study sprint for next week',
    priority: 'Low',
    deadline: '2026-07-24T13:00:00.000Z',
    completed: false,
  },
]

export const activities = [
  {
    id: 'activity-1',
    title: 'AI summary generated',
    detail: 'Machine Learning Revision condensed into a 3-minute recap.',
    time: '20 minutes ago',
  },
  {
    id: 'activity-2',
    title: 'Flashcards reviewed',
    detail: 'Completed 12 cards from Neural Networks Basics.',
    time: '1 hour ago',
  },
  {
    id: 'activity-3',
    title: 'Task completed',
    detail: 'OS lab report marked as done.',
    time: 'Today',
  },
]

export const aiSuggestions = [
  "Turn your latest DBMS notes into flashcards before tomorrow's class.",
  'Your AI notes perform best when summaries stay under five bullet points.',
  'Study streak is strong. Schedule a 30-minute revision block to keep momentum.',
]

export const weeklyStudyData = [
  { day: 'Mon', minutes: 64 },
  { day: 'Tue', minutes: 88 },
  { day: 'Wed', minutes: 54 },
  { day: 'Thu', minutes: 95 },
  { day: 'Fri', minutes: 72 },
  { day: 'Sat', minutes: 110 },
  { day: 'Sun', minutes: 83 },
]

export const notifications = [
  { id: 'notif-1', label: '2 notes need review', time: 'Now' },
  { id: 'notif-2', label: 'Flashcard streak updated', time: '15m' },
  { id: 'notif-3', label: 'Planner deadline approaching', time: '1h' },
]

export const quizQuestions = [
  {
    id: 'quiz-1',
    question: 'Which metric is most useful for imbalanced classification problems?',
    options: ['Accuracy', 'Precision / Recall', 'RMSE', 'Entropy only'],
    answer: 1,
  },
  {
    id: 'quiz-2',
    question: 'What does BCNF primarily ensure?',
    options: [
      'Every table has a primary key',
      'Every determinant is a candidate key',
      'No duplicate rows exist',
      'Only numeric columns are indexed',
    ],
    answer: 1,
  },
  {
    id: 'quiz-3',
    question: 'Which page replacement algorithm often performs best theoretically?',
    options: ['FIFO', 'LRU', 'Optimal', 'Round Robin'],
    answer: 2,
  },
]

export const subjects = ['All', 'AI', 'DBMS', 'OS', 'Math', 'General']
