/**
 * Module 01 — Programming Basics
 *
 * The zero-to-one module. Assumes no prior experience. Establishes the mental
 * models (a program is a recipe, variables are labelled boxes, code runs
 * top-to-bottom) that every later module leans on.
 *
 * This file is the CANONICAL TEMPLATE for authoring modules. Match its shape,
 * block variety, and tone when adding new content.
 */

import type { Module } from '../types';

export const programmingBasicsModule: Module = {
  id: 'basics',
  order: 1,
  title: 'Programming Basics',
  tagline: 'How code thinks, from zero.',
  overview:
    'Before data structures, before algorithms, there is the program itself. ' +
    'This module builds the ground-floor intuition: what a program actually is, ' +
    'how it remembers things with variables, the kinds of values it works with, ' +
    'and how it makes decisions and repeats work. No prior experience assumed.',
  icon: 'terminal',
  difficulty: 'beginner',
  prerequisites: [],
  objectives: [
    'Explain what a program is in one sentence',
    'Store and update values using variables',
    'Recognise the core data types and when to use them',
    'Direct a program with conditionals and loops',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'basics-what-is-a-program',
      moduleId: 'basics',
      title: 'What Is a Program?',
      subtitle: 'A recipe a computer can follow.',
      estimatedMinutes: 6,
      objectives: [
        'Define a program in plain language',
        'Understand that code runs in order, one step at a time',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A program is a list of instructions',
          body:
            'A program is nothing more than a precise list of instructions that a ' +
            'computer carries out in order. The computer is fast and literal — it ' +
            'does exactly what you say, in exactly the order you say it, and nothing ' +
            'more. All of the intelligence in software comes from arranging simple ' +
            'instructions cleverly.',
        },
        {
          type: 'analogy',
          source: 'A recipe',
          body:
            'Think of a recipe. "Boil water. Add pasta. Wait 9 minutes. Drain." ' +
            'You follow each line top to bottom. A program is the same — except the ' +
            'cook never improvises, never skips a step, and never gets tired.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Three instructions, run top to bottom.',
          code: 'name = "Mirai"\ngreeting = "Hello, " + name\nprint(greeting)   # Hello, Mirai',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Order matters',
          body:
            'If you tried to print the greeting before building it, the program ' +
            'would fail — the recipe would ask you to serve a dish you haven’t ' +
            'cooked yet. Sequence is the first rule of programming.',
        },
        {
          type: 'quiz',
          question: 'What is the most accurate description of a program?',
          options: [
            'A machine that thinks for itself',
            'An ordered list of instructions a computer follows exactly',
            'A single magic command',
            'A picture of what you want to happen',
          ],
          answerIndex: 1,
          explanation:
            'A program is an ordered list of precise instructions. The computer ' +
            'follows them literally and in sequence — it does not improvise.',
        },
        {
          type: 'summary',
          points: [
            'A program is an ordered list of instructions.',
            'The computer runs them literally, top to bottom.',
            'Cleverness comes from how you arrange simple steps.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a program?', back: 'An ordered list of instructions a computer follows exactly, in sequence.' },
        { front: 'Why does order matter?', back: 'Each line can depend on the ones before it; running them out of order breaks the logic.' },
      ],
      relatedLessonIds: ['basics-variables'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'basics-variables',
      moduleId: 'basics',
      title: 'Variables & Values',
      subtitle: 'Giving names to things the program remembers.',
      estimatedMinutes: 8,
      objectives: [
        'Create a variable and assign it a value',
        'Update a variable and understand assignment direction',
        'Name variables clearly',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A variable is a labelled box',
          body:
            'A variable is a name that points to a value the program is remembering. ' +
            'You put a value in, refer to it later by name, and change it whenever you ' +
            'like. Without variables a program would have no memory at all.',
        },
        {
          type: 'analogy',
          source: 'A labelled box',
          body:
            'Imagine a shelf of boxes, each with a label. The label "score" might ' +
            'contain the number 10. Later you swap the contents for 25 — the label ' +
            'stays the same, the value inside changes.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Assignment stores the value on the right into the name on the left.',
          code: 'score = 10       # the box "score" now holds 10\nscore = score + 5  # read 10, add 5, store 15 back\nprint(score)     # 15',
        },
        {
          type: 'visual',
          visual: {
            kind: 'array',
            caption: 'Each variable is a labelled cell holding one value.',
            data: {
              cells: ['10', '"Mirai"', 'True'],
              labels: ['score', 'name', 'active'],
            },
          },
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Read assignment right-to-left',
          body:
            'The line `score = score + 5` looks strange mathematically. Read it as: ' +
            '"compute the right side, then store the result in the name on the left."',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Using vague names like `x`, `tmp`, or `data` everywhere.',
              fix: 'Name the value for what it means: `score`, `userName`, `isReady`. Future-you will thank you.',
            },
            {
              mistake: 'Confusing `=` (assign) with `==` (compare).',
              fix: 'A single `=` stores a value; a double `==` asks "are these equal?" and returns true/false.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'After these two lines, what does `count` hold?\n\ncount = 3\ncount = count * 2',
          options: ['3', '6', '32', 'Nothing — it errors'],
          answerIndex: 1,
          explanation:
            'The second line reads the current value (3), multiplies by 2 to get 6, ' +
            'and stores 6 back into `count`.',
        },
        {
          type: 'summary',
          points: [
            'A variable is a name pointing to a value the program remembers.',
            'Assignment (=) computes the right side, then stores it in the left name.',
            'Clear names make code readable; that is a real engineering skill.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a variable?', back: 'A name that points to a stored value, which you can read and update.' },
        { front: 'Difference between = and ==', back: '= assigns a value; == compares two values and yields true/false.' },
        { front: 'How do you read `x = x + 1`?', back: 'Compute the right side using the old value, then store the result back in x.' },
      ],
      relatedLessonIds: ['basics-data-types'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'basics-data-types',
      moduleId: 'basics',
      title: 'Data Types',
      subtitle: 'Numbers, text, and true/false.',
      estimatedMinutes: 8,
      objectives: [
        'Identify the core primitive types',
        'Choose the right type for a value',
        'Understand why "5" and 5 are different',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Values come in kinds',
          body:
            'Every value has a type — a category that decides what you can do with it. ' +
            'You can add numbers, join text, and flip true/false. Mixing types ' +
            'carelessly is one of the most common sources of beginner bugs.',
        },
        {
          type: 'list',
          heading: 'The core primitive types',
          items: [
            'Integer — whole numbers: 0, 42, -7',
            'Float — decimal numbers: 3.14, -0.5',
            'String — text in quotes: "hello", "Mirai"',
            'Boolean — a truth value: True or False',
          ],
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Same-looking values, different types, different behaviour.',
          code: 'total = 5 + 3        # 8   (integers add)\nlabel = "5" + "3"    # "53" (strings join)\nready = 5 > 3        # True (comparison yields a boolean)',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: '"5" is not 5',
          body:
            'The string "5" is text that happens to look like a number. You can’t ' +
            'do arithmetic on it until you convert it. This trips up nearly every ' +
            'beginner reading input from a keyboard or a file.',
        },
        {
          type: 'quiz',
          question: 'What is the result of "3" + "4" in most languages?',
          options: ['7', '"34"', 'An error', '12'],
          answerIndex: 1,
          explanation:
            'Both operands are strings, so + joins them into the text "34". To add ' +
            'them as numbers you must convert them first.',
        },
        {
          type: 'summary',
          points: [
            'Every value has a type that governs what operations are legal.',
            'Core types: integer, float, string, boolean.',
            'Text that looks numeric ("5") is still text until converted.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Name the four core primitive types.', back: 'Integer, float, string, boolean.' },
        { front: 'Why is "5" + "5" not 10?', back: 'Both are strings, so + joins them into "55". Convert to numbers to add.' },
      ],
      relatedLessonIds: ['basics-control-flow'],
    },

    // ── Lesson 4 ──────────────────────────────────────────────────────────
    {
      id: 'basics-control-flow',
      moduleId: 'basics',
      title: 'Control Flow',
      subtitle: 'Making decisions and repeating work.',
      estimatedMinutes: 10,
      objectives: [
        'Branch logic with if / else',
        'Repeat work with a loop',
        'Trace how execution jumps around',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Programs choose and repeat',
          body:
            'So far code has run straight down. Control flow lets a program change ' +
            'course: run some lines only when a condition holds (branching), or run ' +
            'the same lines many times (looping). These two ideas power almost every ' +
            'algorithm you will ever write.',
        },
        {
          type: 'walkthrough',
          heading: 'A conditional, step by step',
          language: 'python',
          steps: [
            { code: 'age = 20', explanation: 'Store the value we’ll test.' },
            { code: 'if age >= 18:', explanation: 'Ask a yes/no question. 20 >= 18 is True, so we enter the block.' },
            { code: '    print("Adult")', explanation: 'This indented line runs only because the condition was True.' },
            { code: 'else:', explanation: 'The fallback branch — runs only when the condition is False.' },
            { code: '    print("Minor")', explanation: 'Skipped here, because we already took the "if" branch.' },
          ],
        },
        {
          type: 'concept',
          heading: 'Loops repeat until done',
          body:
            'A loop runs a block of code over and over. A `for` loop repeats a set ' +
            'number of times; a `while` loop repeats as long as a condition stays ' +
            'true. Every list you ever process, you process with a loop.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Print 0, 1, 2 — the loop body runs three times.',
          code: 'for i in range(3):\n    print(i)   # 0, then 1, then 2',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Writing a `while` loop whose condition never becomes false.',
              fix: 'Ensure something inside the loop moves toward the exit — otherwise it runs forever (an "infinite loop").',
            },
            {
              mistake: 'Off-by-one errors, e.g. looping 1 too few or too many times.',
              fix: 'Remember range(3) yields 0,1,2 — three values, but stopping before 3.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'How many times does the body of `for i in range(5)` run?',
          options: ['4', '5', '6', 'Depends on i'],
          answerIndex: 1,
          explanation:
            'range(5) yields 0,1,2,3,4 — five values — so the body runs exactly 5 times.',
        },
        {
          type: 'summary',
          points: [
            'Conditionals (if/else) run code only when a condition holds.',
            'Loops (for/while) repeat a block of code.',
            'Branching + looping are the engine behind every algorithm.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What does an if/else do?', back: 'Runs one branch when a condition is true, another when it is false.' },
        { front: 'for vs while loop?', back: 'for repeats a known number of times; while repeats as long as a condition stays true.' },
        { front: 'How many values does range(n) produce?', back: 'n values: 0 through n-1.' },
      ],
      relatedLessonIds: ['big-o-what-is-big-o'],
    },
  ],
};
