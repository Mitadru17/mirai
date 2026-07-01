/**
 * Module 06 — Stacks
 *
 * The first true data structure with a personality: Last-In, First-Out. Stacks
 * are deceptively simple — push, pop, peek — yet they unlock a family of elegant
 * solutions, from balancing brackets to the monotonic-stack pattern. Exercises
 * the `stack` visual and leans on the arrays foundation.
 */

import type { Module } from '../types';

export const stacksModule: Module = {
  id: 'stacks',
  order: 6,
  title: 'Stacks',
  tagline: 'Last in, first out — the pile you build and unbuild.',
  overview:
    'A stack keeps things in the order you added them, but hands them back in ' +
    'reverse. You add to the top and you take from the top — never the middle. ' +
    'That one rule, called Last-In-First-Out, turns out to be exactly what you ' +
    'need to undo actions, match brackets, walk back through a browser history, ' +
    'and much more. This module builds the stack from the ground up and ends with ' +
    'a pattern that makes seasoned engineers smile: the monotonic stack.',
  icon: 'layers',
  difficulty: 'beginner',
  prerequisites: ['arrays'],
  objectives: [
    'Describe the LIFO rule and the push, pop, and peek operations',
    'Explain why every core stack operation is O(1)',
    'Use a stack to validate matching parentheses',
    'Recognise when a monotonic stack turns O(n²) work into O(n)',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'stacks-what-is-a-stack',
      moduleId: 'stacks',
      title: 'What Is a Stack?',
      subtitle: 'Last in, first out.',
      estimatedMinutes: 7,
      objectives: [
        'Define a stack and the LIFO rule',
        'Name the three core operations: push, pop, peek',
        'Connect stacks to everyday examples',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A stack only touches the top',
          body:
            'A stack is a collection with one strict rule: you may only add to the ' +
            'top and only remove from the top. The last item you put on is the first ' +
            'one you take off. This is called LIFO — Last In, First Out. There is no ' +
            'reaching into the middle; if you want the third item down, you must ' +
            'remove the two above it first.',
        },
        {
          type: 'analogy',
          source: 'A stack of plates',
          body:
            'Picture a pile of plates on a counter. You wash a plate and set it on ' +
            'top. When you need one, you take the top plate — the one you added most ' +
            'recently. You would never yank a plate from the middle of the pile. A ' +
            'stack in code behaves exactly like that pile: top on, top off.',
        },
        {
          type: 'analogy',
          source: 'The browser back button',
          body:
            'Every page you visit gets pushed onto a stack. Press "back" and the ' +
            'browser pops the most recent page and returns you to the one before it. ' +
            'The history unwinds in the reverse order you built it — pure LIFO.',
        },
        {
          type: 'list',
          heading: 'The three core operations',
          items: [
            'push — add an item to the top of the stack',
            'pop — remove and return the item on top',
            'peek — look at the top item without removing it',
          ],
        },
        {
          type: 'visual',
          visual: {
            kind: 'stack',
            caption: 'C was pushed last, so it sits on top and pops off first.',
            data: {
              items: ['A', 'B', 'C'],
            },
          },
        },
        {
          type: 'callout',
          tone: 'info',
          title: 'The top is the only door',
          body:
            'A stack deliberately hides its middle. That restriction is a feature, ' +
            'not a limitation — because access is so simple, every operation is fast ' +
            'and the structure is easy to reason about.',
        },
        {
          type: 'quiz',
          question:
            'You push 1, then 2, then 3 onto an empty stack. What does the next pop return?',
          options: ['1', '2', '3', 'The stack is empty'],
          answerIndex: 2,
          explanation:
            '3 was pushed last, so it sits on top. LIFO means the most recently ' +
            'added item comes off first — pop returns 3.',
        },
        {
          type: 'summary',
          points: [
            'A stack is Last In, First Out: add and remove only at the top.',
            'Core operations are push (add), pop (remove top), and peek (look at top).',
            'Everyday stacks: a pile of plates, the browser back button, undo history.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What does LIFO stand for?', back: 'Last In, First Out — the most recently added item is removed first.' },
        { front: 'Name the three core stack operations.', back: 'push (add to top), pop (remove the top), peek (view the top without removing).' },
        { front: 'Can you access the middle of a stack directly?', back: 'No — you can only touch the top. Reaching a lower item means popping the ones above it.' },
      ],
      relatedLessonIds: ['stacks-operations'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'stacks-operations',
      moduleId: 'stacks',
      title: 'Stack Operations',
      subtitle: 'Why push, pop, and peek are all O(1).',
      estimatedMinutes: 8,
      objectives: [
        'Perform push, pop, and peek in code',
        'Explain why each operation is constant time',
        'Handle the empty-stack case safely',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Everything happens at one end',
          body:
            'Because a stack only ever adds or removes at the top, each operation ' +
            'touches a single, known position — never the whole collection. Adding ' +
            'a plate to a pile takes the same effort whether the pile is 3 tall or ' +
            '3000 tall. That is the essence of constant time.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'A Python list makes a perfect stack: append is push, pop is pop.',
          code:
            'stack = []\n' +
            'stack.append("A")   # push A  -> ["A"]\n' +
            'stack.append("B")   # push B  -> ["A", "B"]\n' +
            'top = stack[-1]     # peek    -> "B" (stack unchanged)\n' +
            'item = stack.pop()  # pop     -> "B", stack is ["A"]',
        },
        {
          type: 'complexity',
          heading: 'Every core operation is constant time',
          rows: [
            { operation: 'push (add to top)', time: 'O(1)', space: 'O(1)', note: 'Append at the end — no shifting of other items.' },
            { operation: 'pop (remove top)', time: 'O(1)', space: 'O(1)', note: 'Remove the last item — nothing else moves.' },
            { operation: 'peek (view top)', time: 'O(1)', space: 'O(1)', note: 'Read the last item directly by index.' },
            { operation: 'isEmpty / size', time: 'O(1)', space: 'O(1)', note: 'Just check the length.' },
          ],
        },
        {
          type: 'analogy',
          source: 'A spring-loaded plate dispenser',
          body:
            'Diners have those spring dispensers that hold a stack of plates. Push ' +
            'a plate down and it clicks into place at the top; take one and the next ' +
            'rises. You never rearrange the whole column — you only ever deal with ' +
            'the plate at the surface. That single-position access is why stacks are ' +
            'so cheap.',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Popping an empty stack',
          body:
            'Calling pop or peek on an empty stack is a classic crash. Always guard ' +
            'with an "is it empty?" check before you reach for the top.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Popping or peeking without checking whether the stack is empty.',
              fix: 'Guard first: `if stack:` in Python, or check the size before touching the top.',
            },
            {
              mistake: 'Confusing peek with pop — assuming peek also removes the item.',
              fix: 'peek only reads the top and leaves the stack unchanged; pop removes it.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'What is the time complexity of pushing an item onto a stack?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          answerIndex: 0,
          explanation:
            'A push adds to the top only, touching a single position regardless of ' +
            'how many items the stack already holds — constant time, O(1).',
        },
        {
          type: 'summary',
          points: [
            'push, pop, and peek all run in O(1) — they only touch the top.',
            'A Python list works as a stack: append to push, pop() to pop, [-1] to peek.',
            'Guard against popping or peeking an empty stack, or your program will crash.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Why are stack operations O(1)?', back: 'They only ever touch the top position, so the work does not grow with the number of items.' },
        { front: 'How do you build a stack from a Python list?', back: 'append(x) to push, pop() to remove the top, and list[-1] to peek.' },
        { front: 'What should you check before popping?', back: 'Whether the stack is empty — popping or peeking an empty stack raises an error.' },
      ],
      relatedLessonIds: ['stacks-valid-parentheses'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'stacks-valid-parentheses',
      moduleId: 'stacks',
      title: 'Valid Parentheses',
      subtitle: 'The problem stacks were born to solve.',
      estimatedMinutes: 10,
      objectives: [
        'Recognise nested-matching problems as a stack fit',
        'Trace the push/pop logic for balancing brackets',
        'Know the two ways the check can fail',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Matching brackets is a stack problem',
          body:
            'Given a string of brackets like "([]){}", decide whether every opener ' +
            'has a correctly nested closer. The trick: push each opening bracket onto ' +
            'a stack. When you meet a closing bracket, it must match whatever is on ' +
            'top — the most recent unclosed opener. If it matches, pop; if not, the ' +
            'string is invalid. The "most recent" rule is exactly LIFO.',
        },
        {
          type: 'analogy',
          source: 'Unwrapping nested boxes',
          body:
            'Imagine opening a box, finding a smaller box inside, opening that too. ' +
            'To close up, you must seal the inner box before the outer one — reverse ' +
            'order. Brackets nest the same way: the last one you opened is the first ' +
            'one you must close.',
        },
        {
          type: 'walkthrough',
          heading: 'Checking "([])" step by step',
          language: 'python',
          steps: [
            { code: 'stack = []', explanation: 'Start with an empty stack to hold unmatched openers.' },
            { code: "read '(' -> push", explanation: "'(' is an opener. Push it. Stack: ['(']." },
            { code: "read '[' -> push", explanation: "'[' is an opener. Push it. Stack: ['(', '[']." },
            { code: "read ']' -> pop '['", explanation: "']' closes the top '['. They match, so pop. Stack: ['(']." },
            { code: "read ')' -> pop '('", explanation: "')' closes the top '('. They match, so pop. Stack: []." },
            { code: 'stack is empty -> valid', explanation: 'Every opener was matched and the stack is empty, so the string is balanced.' },
          ],
        },
        {
          type: 'code',
          language: 'python',
          caption: 'A complete, correct solution in a handful of lines.',
          code:
            'def is_valid(s):\n' +
            '    pairs = {")": "(", "]": "[", "}": "{"}\n' +
            '    stack = []\n' +
            '    for ch in s:\n' +
            '        if ch in "([{":\n' +
            '            stack.append(ch)\n' +
            '        else:\n' +
            '            if not stack or stack.pop() != pairs[ch]:\n' +
            '                return False\n' +
            '    return not stack',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Two ways to fail',
          body:
            'The string is invalid if a closer appears with no matching opener on ' +
            'top (a mismatch, or the stack is empty), OR if the stack is non-empty at ' +
            'the end — meaning some opener was never closed.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Only counting brackets, e.g. checking that "(" and ")" appear the same number of times.',
              fix: 'Order matters: ")(" has equal counts but is invalid. A stack enforces the correct nesting, not just the totals.',
            },
            {
              mistake: 'Forgetting to check that the stack is empty at the very end.',
              fix: 'A leftover opener like "((" means something was never closed — return False if the stack is not empty.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Using the stack method, why is the string ")(" invalid?',
          options: [
            'It has an odd number of characters',
            'The first ")" tries to pop from an empty stack',
            'The two brackets are different types',
            'It is actually valid',
          ],
          answerIndex: 1,
          explanation:
            'Reading left to right, the first character ")" is a closer, but the ' +
            'stack is empty — there is no opener to match. That immediately fails, ' +
            'even though the counts of "(" and ")" are equal.',
        },
        {
          type: 'summary',
          points: [
            'Push openers; when a closer arrives it must match the top, then pop.',
            'The LIFO order guarantees brackets are correctly nested, not just counted.',
            'Invalid if a closer has no match, or if the stack is non-empty at the end.',
          ],
        },
      ],
      revisionCards: [
        { front: 'How does a stack validate matching brackets?', back: 'Push each opener; on a closer, it must match the top opener (then pop). Empty stack at the end means valid.' },
        { front: 'Why does ")(" fail?', back: 'The leading ")" tries to pop an empty stack — there is no opener to match it.' },
        { front: 'When is a bracket string invalid at the end?', back: 'When the stack is still non-empty, meaning an opener was never closed.' },
      ],
      relatedLessonIds: ['stacks-monotonic'],
    },

    // ── Lesson 4 ──────────────────────────────────────────────────────────
    {
      id: 'stacks-monotonic',
      moduleId: 'stacks',
      title: 'The Monotonic Stack',
      subtitle: 'One pass to find the next greater element.',
      estimatedMinutes: 11,
      objectives: [
        'Understand what "monotonic" means for a stack',
        'Solve next-greater-element in a single pass',
        'See why the total work is amortised O(n)',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A stack kept in sorted order',
          body:
            'A monotonic stack is an ordinary stack with a promise: its contents stay ' +
            'in order — always increasing, or always decreasing, from bottom to top. ' +
            'Before you push a new value, you pop off anything that would break that ' +
            'order. This simple discipline solves a whole class of "find the nearest ' +
            'bigger or smaller neighbour" problems in one pass.',
        },
        {
          type: 'concept',
          heading: 'Next greater element',
          body:
            'For each number in a list, we want the first number to its right that ' +
            'is larger — its "next greater element", or -1 if none exists. The brute ' +
            'force is a nested loop, O(n²). A monotonic stack does it in O(n) by ' +
            'remembering the values still waiting for a bigger neighbour.',
        },
        {
          type: 'analogy',
          source: 'A queue of people waiting to be beaten',
          body:
            'Line up people by height, each waiting to spot the first taller person ' +
            'who walks past. When a tall person arrives, everyone shorter still ' +
            'waiting gets their answer at once and leaves the line. Each person joins ' +
            'and leaves the line exactly once — no one is checked over and over.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Next greater element for each item, in a single left-to-right pass.',
          code:
            'def next_greater(nums):\n' +
            '    result = [-1] * len(nums)\n' +
            '    stack = []  # holds indices, values decreasing bottom->top\n' +
            '    for i, x in enumerate(nums):\n' +
            '        while stack and nums[stack[-1]] < x:\n' +
            '            j = stack.pop()\n' +
            '            result[j] = x   # x is j\'s next greater element\n' +
            '        stack.append(i)\n' +
            '    return result',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Why it is O(n), not O(n²)',
          body:
            'The inner while loop looks scary, but here is the key: each index is ' +
            'pushed exactly once and popped at most once across the entire run. That ' +
            'caps the total number of pushes and pops at 2n, so the whole algorithm ' +
            'is O(n). This "count the total work, not the worst single step" idea is ' +
            'called amortised analysis.',
        },
        {
          type: 'visual',
          visual: {
            kind: 'stack',
            caption: 'Indices wait on the stack, values decreasing upward, until a bigger value pops them.',
            data: {
              items: ['5', '3', '1'],
            },
          },
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Assuming the inner while loop makes the algorithm O(n²).',
              fix: 'Amortise it: each element is pushed and popped at most once, so total work is O(n) despite the nested loop.',
            },
            {
              mistake: 'Storing values on the stack when you actually need their positions.',
              fix: 'Store indices when you must write results back into a specific slot; read nums[index] to get the value.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'What is the overall time complexity of the monotonic-stack next-greater-element solution?',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(log n)'],
          answerIndex: 2,
          explanation:
            'Each element is pushed once and popped at most once, so across the ' +
            'whole run there are at most 2n stack operations. That is O(n) overall, ' +
            'even though there is a loop inside a loop.',
        },
        {
          type: 'summary',
          points: [
            'A monotonic stack keeps its contents strictly increasing or decreasing.',
            'It finds the next greater (or smaller) element in a single O(n) pass.',
            'The nested loop is fine because each element is pushed and popped once — amortised O(n).',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a monotonic stack?', back: 'A stack whose contents are kept in order (all increasing or all decreasing) by popping violators before each push.' },
        { front: 'What problem does it classically solve?', back: 'Next greater / next smaller element — the nearest larger or smaller neighbour — in O(n).' },
        { front: 'Why is it O(n) despite a nested loop?', back: 'Each element is pushed once and popped at most once, so total operations are bounded by 2n — amortised O(n).' },
      ],
      relatedLessonIds: ['stacks-valid-parentheses'],
    },
  ],
};
