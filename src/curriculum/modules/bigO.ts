/**
 * Module 02 — Big-O Notation
 *
 * The measuring stick for the rest of the course. Teaches how to reason about
 * how an algorithm scales, independent of language or hardware. Exercises the
 * `complexity` table block and the `bigo` growth-chart visual.
 */

import type { Module } from '../types';

export const bigOModule: Module = {
  id: 'big-o',
  order: 2,
  title: 'Big-O Notation',
  tagline: 'How to measure the cost of code.',
  overview:
    'Two solutions can both be "correct" yet one is instant and the other takes ' +
    'a lifetime on real data. Big-O is the language engineers use to describe how ' +
    'an algorithm’s work grows as its input grows. Master this and every later ' +
    'module gains a shared vocabulary for trade-offs.',
  icon: 'gauge',
  difficulty: 'beginner',
  prerequisites: ['basics'],
  objectives: [
    'Explain what Big-O measures and why constants are dropped',
    'Recognise the common complexity classes on sight',
    'Estimate the Big-O of a simple piece of code',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'big-o-what-is-big-o',
      moduleId: 'big-o',
      title: 'What Is Big-O?',
      subtitle: 'Measuring growth, not seconds.',
      estimatedMinutes: 8,
      objectives: [
        'Understand that Big-O describes growth as input scales',
        'See why we ignore hardware and constant factors',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Big-O describes how work scales',
          body:
            'Big-O answers one question: as the input gets bigger, how does the ' +
            'amount of work grow? We don’t count exact seconds — those depend on the ' +
            'machine — we count how the number of steps grows relative to the input ' +
            'size, usually called n.',
        },
        {
          type: 'analogy',
          source: 'Finding a name in a phone book',
          body:
            'Reading every name one by one gets twice as slow when the book doubles ' +
            'in size. Flipping to the middle and halving repeatedly barely changes ' +
            'even for a book a thousand times bigger. Big-O captures exactly that ' +
            'difference in how the two approaches scale.',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'We drop constants and lower terms',
          body:
            'An algorithm doing 2n + 100 steps is written O(n). Why? For large n, ' +
            'the doubling and the +100 are dwarfed by how n itself grows. Big-O keeps ' +
            'only the term that dominates at scale.',
        },
        {
          type: 'quiz',
          question: 'What does Big-O primarily measure?',
          options: [
            'The exact runtime in seconds',
            'How the amount of work grows as the input grows',
            'How much memory a language uses',
            'The number of lines of code',
          ],
          answerIndex: 1,
          explanation:
            'Big-O describes the growth rate of work as a function of input size — ' +
            'not wall-clock time, which varies by machine.',
        },
        {
          type: 'summary',
          points: [
            'Big-O measures how work grows as input size n grows.',
            'It ignores hardware and constant factors.',
            'Only the dominant term is kept: 2n + 100 → O(n).',
          ],
        },
      ],
      revisionCards: [
        { front: 'What does Big-O measure?', back: 'The growth rate of work (or memory) as the input size n increases.' },
        { front: 'Why is 2n + 100 just O(n)?', back: 'For large n the constant factor and lower-order term stop mattering; only the dominant term is kept.' },
      ],
      relatedLessonIds: ['big-o-common-complexities'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'big-o-common-complexities',
      moduleId: 'big-o',
      title: 'Common Complexities',
      subtitle: 'The handful you’ll meet again and again.',
      estimatedMinutes: 10,
      objectives: [
        'Recognise O(1), O(log n), O(n), O(n log n), O(n²)',
        'Rank complexities from fastest to slowest',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A small family of shapes',
          body:
            'Almost all everyday code falls into a handful of complexity classes. ' +
            'Learn their shapes and you can eyeball the cost of most algorithms.',
        },
        {
          type: 'visual',
          visual: {
            kind: 'bigo',
            caption: 'How each class grows as input size increases. Lower is better.',
            data: {
              classes: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
            },
          },
        },
        {
          type: 'complexity',
          heading: 'The essentials, best to worst',
          rows: [
            { operation: 'O(1) — constant', time: 'O(1)', note: 'Same work regardless of n. e.g. array index access.' },
            { operation: 'O(log n) — logarithmic', time: 'O(log n)', note: 'Halves the problem each step. e.g. binary search.' },
            { operation: 'O(n) — linear', time: 'O(n)', note: 'Work grows with n. e.g. one pass over a list.' },
            { operation: 'O(n log n) — linearithmic', time: 'O(n log n)', note: 'Best general sorting. e.g. merge sort.' },
            { operation: 'O(n²) — quadratic', time: 'O(n²)', note: 'Nested loop over the data. Avoid on large n.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'A rule of thumb',
          body:
            'A single loop over the data is usually O(n). A loop inside a loop over ' +
            'the same data is usually O(n²). Halving the problem each step is O(log n).',
        },
        {
          type: 'quiz',
          question: 'Which of these grows the SLOWEST as n gets huge?',
          options: ['O(n²)', 'O(n log n)', 'O(log n)', 'O(n)'],
          answerIndex: 2,
          explanation:
            'O(log n) grows slowest here — doubling n adds just one more step. O(n²) grows fastest.',
        },
        {
          type: 'summary',
          points: [
            'Common classes: O(1), O(log n), O(n), O(n log n), O(n²).',
            'Fastest-growing of these is O(n²); slowest is O(1)/O(log n).',
            'Nested loops hint at O(n²); halving hints at O(log n).',
          ],
        },
      ],
      revisionCards: [
        { front: 'Order these best→worst: O(n²), O(1), O(n), O(log n).', back: 'O(1) < O(log n) < O(n) < O(n²).' },
        { front: 'What complexity is binary search?', back: 'O(log n) — it halves the search space each step.' },
        { front: 'A loop nested in a loop over n items is usually…', back: 'O(n²).' },
      ],
      relatedLessonIds: ['big-o-analyzing-code'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'big-o-analyzing-code',
      moduleId: 'big-o',
      title: 'Analyzing Your Code',
      subtitle: 'Reading complexity straight off the page.',
      estimatedMinutes: 9,
      objectives: [
        'Count complexity from loop structure',
        'Combine sequential and nested work correctly',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Loops are the tell',
          body:
            'To estimate Big-O, look at the loops. One pass over n items is O(n). ' +
            'Two separate passes is still O(n) (we drop the constant). A loop nested ' +
            'inside another, each over n items, is O(n × n) = O(n²).',
        },
        {
          type: 'walkthrough',
          heading: 'Spotting O(n²)',
          language: 'python',
          steps: [
            { code: 'for i in range(n):', explanation: 'Outer loop runs n times.' },
            { code: '    for j in range(n):', explanation: 'For each outer step, the inner loop runs n times.' },
            { code: '        print(i, j)', explanation: 'This line runs n × n = n² times in total → O(n²).' },
          ],
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Sequential loops add, they don’t multiply → O(n), not O(n²).',
          code: 'for x in items:   # O(n)\n    process(x)\nfor y in items:   # another O(n)\n    process(y)\n# Total: O(n) + O(n) = O(2n) = O(n)',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Assuming two loops in a row means O(n²).',
              fix: 'Sequential loops add (O(n) + O(n) = O(n)). Only nesting multiplies.',
            },
            {
              mistake: 'Forgetting that a hidden operation (like `x in list`) can itself be O(n).',
              fix: 'Check the cost of the operations inside your loop, not just the loop count.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'A loop over n items containing a second loop over the same n items is…',
          options: ['O(n)', 'O(2n)', 'O(n²)', 'O(log n)'],
          answerIndex: 2,
          explanation:
            'Nesting multiplies: n outer × n inner = n² total operations → O(n²).',
        },
        {
          type: 'summary',
          points: [
            'One pass = O(n); sequential passes still O(n).',
            'Nested loops multiply → O(n²).',
            'Account for the hidden cost of operations inside loops.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Two loops one after another over n items?', back: 'O(n) — sequential loops add, and constants are dropped.' },
        { front: 'A loop nested inside a loop, each over n?', back: 'O(n²) — nesting multiplies the counts.' },
      ],
      relatedLessonIds: ['arrays-what-is-an-array'],
    },
  ],
};
