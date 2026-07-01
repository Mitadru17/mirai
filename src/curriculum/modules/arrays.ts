/**
 * Module 03 — Arrays
 *
 * The first real data structure. Builds the mental model of contiguous memory,
 * why indexed access is instant, and where the hidden costs live. Introduces the
 * two workhorse patterns — two pointers and sliding window — that unlock a huge
 * fraction of array interview problems.
 *
 * Exercises the `array` visual, the `complexity` table, `walkthrough`, and
 * `code` blocks.
 */

import type { Module } from '../types';

export const arraysModule: Module = {
  id: 'arrays',
  order: 3,
  title: 'Arrays',
  tagline: 'The data structure everything else is built on.',
  overview:
    'An array is the simplest way to hold a list of values — and the foundation ' +
    'beneath strings, stacks, hash tables, and more. Its superpower is instant, ' +
    'jump-anywhere access by index. Its catch is that adding or removing from the ' +
    'middle means shuffling everything over. This module builds that intuition, ' +
    'then teaches the two-pointer and sliding-window patterns that turn slow, ' +
    'nested-loop solutions into clean linear ones.',
  icon: 'brackets',
  difficulty: 'beginner',
  prerequisites: ['big-o'],
  objectives: [
    'Explain how arrays store data in contiguous memory and index from 0',
    'Reason about the cost of access, search, insertion, and deletion',
    'Apply the two-pointer pattern to solve problems in a single pass',
    'Apply the sliding-window pattern to shrink O(n·k) work down to O(n)',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'arrays-what-is-an-array',
      moduleId: 'arrays',
      title: 'What Is an Array?',
      subtitle: 'A row of boxes, numbered from zero.',
      estimatedMinutes: 8,
      objectives: [
        'Describe an array as contiguous, indexed storage',
        'Distinguish a fixed-size array from a dynamic one',
        'Read and write elements by their zero-based index',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A block of values, side by side',
          body:
            'An array stores its values one after another in a single, unbroken block ' +
            'of memory. Because the values sit next to each other and are all the same ' +
            'size, the computer can jump straight to any one of them by doing a little ' +
            'arithmetic — no searching required. That contiguity is the whole reason ' +
            'arrays are so fast to read from.',
        },
        {
          type: 'analogy',
          source: 'A row of lockers',
          body:
            'Picture a hallway of identical lockers in a straight line, numbered ' +
            'starting at 0. If you know a locker’s number, you walk straight to it — ' +
            'you don’t peek inside every locker along the way. An array index works ' +
            'exactly like that locker number.',
        },
        {
          type: 'visual',
          visual: {
            kind: 'array',
            caption: 'Indices run 0..4 along the bottom. Index 2 (the value 7) is highlighted.',
            data: {
              cells: ['3', '8', '7', '1', '9'],
              labels: ['0', '1', '2', '3', '4'],
              highlight: 2,
            },
          },
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Why counting starts at 0',
          body:
            'The index is really an offset — "how many elements from the start?" The ' +
            'first element is 0 steps from the start, so it lives at index 0. The ' +
            'computer finds an element with: start address + index × element size.',
        },
        {
          type: 'concept',
          heading: 'Fixed vs. dynamic arrays',
          body:
            'A fixed-size array is created with a set length that never changes — great ' +
            'when you know exactly how many items you need. A dynamic array (Python’s ' +
            'list, Java’s ArrayList) grows on demand: when it fills up, it quietly ' +
            'allocates a bigger block and copies everything over, so you can just keep ' +
            'appending.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Indexing is direct and instant, from either end.',
          code: 'nums = [3, 8, 7, 1, 9]\nprint(nums[0])    # 3  (first element)\nprint(nums[2])    # 7  (third element)\nprint(nums[-1])   # 9  (last element)',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Thinking the last index of a 5-element array is 5.',
              fix: 'Indices run 0..n-1. A 5-element array has indices 0,1,2,3,4 — the last is 4.',
            },
            {
              mistake: 'Assuming a dynamic array’s growth is free.',
              fix: 'Most appends are O(1), but the occasional resize copies every element. It averages out to O(1), but the copy is real.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'In the array [3, 8, 7, 1, 9], which value does index 2 refer to?',
          options: ['8', '7', '3', '1'],
          answerIndex: 1,
          explanation:
            'Indexing starts at 0, so index 0 is 3, index 1 is 8, and index 2 is 7.',
        },
        {
          type: 'summary',
          points: [
            'An array is a contiguous block of same-sized values.',
            'Contiguity lets the computer jump to any index instantly with arithmetic.',
            'Indices start at 0; the last valid index is n-1.',
            'Fixed arrays have a set size; dynamic arrays grow by copying into a bigger block.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Why can arrays jump to any index instantly?', back: 'Elements are contiguous and equal-sized, so the address is start + index × size — pure arithmetic, no scanning.' },
        { front: 'What is the last valid index of an n-element array?', back: 'n − 1, because indexing starts at 0.' },
        { front: 'Fixed vs. dynamic array?', back: 'Fixed has an unchangeable length; dynamic grows on demand by allocating a bigger block and copying elements over.' },
      ],
      relatedLessonIds: ['arrays-operations'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'arrays-operations',
      moduleId: 'arrays',
      title: 'Array Operations & Cost',
      subtitle: 'Fast reads, expensive middles.',
      estimatedMinutes: 10,
      objectives: [
        'State the cost of access, search, insertion, and deletion',
        'Explain why inserting or deleting in the middle requires shifting',
        'Choose operations that keep work at the cheaper end of the array',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Access is instant; changing the shape is not',
          body:
            'Reading a value by index is O(1) — the computer computes the address and ' +
            'grabs it. The expensive operations are the ones that change how many ' +
            'elements sit before a given position, because everything after that ' +
            'position has to slide to keep the block contiguous.',
        },
        {
          type: 'concept',
          heading: 'The end is cheap, the middle is costly',
          body:
            'Inserting at the very end usually just drops a value into the next free ' +
            'slot — O(1) on average. Inserting in the middle means every later element ' +
            'must shift one slot to the right to open a gap, which is O(n). Deletion is ' +
            'the mirror image: remove from the end cheaply, but delete from the middle ' +
            'and everything after slides left to close the gap.',
        },
        {
          type: 'analogy',
          source: 'Cutting into a line of people',
          body:
            'To let someone join the front of a queue, everyone behind has to take a ' +
            'step back to make room. Joining the very end bothers nobody. Arrays feel ' +
            'the same pain: squeezing into the middle forces everyone after you to move.',
        },
        {
          type: 'complexity',
          heading: 'Array operation costs',
          rows: [
            { operation: 'Access by index', time: 'O(1)', space: 'O(1)', note: 'Direct address arithmetic — no scanning.' },
            { operation: 'Search (unsorted)', time: 'O(n)', space: 'O(1)', note: 'May have to check every element.' },
            { operation: 'Insert at end', time: 'O(1)', space: 'O(1)', note: 'Amortized — an occasional resize copies all elements.' },
            { operation: 'Insert in middle', time: 'O(n)', space: 'O(1)', note: 'Every later element shifts right to open a gap.' },
            { operation: 'Delete from middle', time: 'O(n)', space: 'O(1)', note: 'Every later element shifts left to close the gap.' },
          ],
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Appending is cheap; inserting at the front shifts everything.',
          code: 'nums = [10, 20, 30]\nnums.append(40)      # [10, 20, 30, 40]  — O(1) at the end\nnums.insert(0, 5)    # [5, 10, 20, 30, 40] — O(n), all shift right\ndel nums[1]          # [5, 20, 30, 40]    — O(n), all shift left',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Prefer the end',
          body:
            'When you can choose where to add or remove, favour the end of the array. ' +
            'Building a result by appending and only reversing once at the end is a ' +
            'common way to keep an algorithm linear.',
        },
        {
          type: 'quiz',
          question: 'Why is inserting into the middle of an array O(n)?',
          options: [
            'The computer has to search for a free slot',
            'Every element after the insertion point must shift over by one',
            'Arrays cannot be modified once created',
            'It has to re-sort the entire array',
          ],
          answerIndex: 1,
          explanation:
            'To open a gap, every element after the insertion point slides one position ' +
            'right. In the worst case that is n elements, so the cost is O(n).',
        },
        {
          type: 'summary',
          points: [
            'Access by index is O(1); searching an unsorted array is O(n).',
            'Insert/delete at the end is cheap (O(1) amortized).',
            'Insert/delete in the middle is O(n) because later elements must shift.',
            'When you can, do your adding and removing at the end.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Cost of accessing arr[i]?', back: 'O(1) — computed directly from the start address and index.' },
        { front: 'Why is middle insertion O(n)?', back: 'Every element after the insertion point must shift one slot to make room.' },
        { front: 'Cost of appending to a dynamic array?', back: 'O(1) amortized — cheap on average, with rare O(n) resizes that copy everything.' },
      ],
      relatedLessonIds: ['arrays-two-pointers'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'arrays-two-pointers',
      moduleId: 'arrays',
      title: 'The Two-Pointer Pattern',
      subtitle: 'Two indices doing the work of a nested loop.',
      estimatedMinutes: 11,
      objectives: [
        'Recognise when a two-pointer approach applies',
        'Use opposite-ends pointers to process an array from both sides',
        'Understand the fast/slow variation and its uses',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Walk the array with two markers',
          body:
            'The two-pointer pattern keeps two indices moving through an array instead ' +
            'of one. In the opposite-ends form, one pointer starts at the left and one ' +
            'at the right, and they move toward each other. This often replaces a nested ' +
            'loop — turning O(n²) work into a single O(n) pass.',
        },
        {
          type: 'analogy',
          source: 'Two people folding a banner',
          body:
            'To fold a long banner neatly, two people grab opposite ends and walk ' +
            'toward the middle, meeting in the center. Neither has to walk the whole ' +
            'length alone. Opposite-ends pointers cover the array the same way — ' +
            'together they touch every element just once.',
        },
        {
          type: 'walkthrough',
          heading: 'Reversing an array in place',
          language: 'python',
          steps: [
            { code: 'left, right = 0, len(nums) - 1', explanation: 'Put one pointer at the first index and one at the last.' },
            { code: 'while left < right:', explanation: 'Keep going until the pointers meet in the middle. Once they cross, every pair has been handled.' },
            { code: '    nums[left], nums[right] = nums[right], nums[left]', explanation: 'Swap the two ends. Python swaps both values in a single step.' },
            { code: '    left += 1', explanation: 'Move the left pointer one step inward.' },
            { code: '    right -= 1', explanation: 'Move the right pointer one step inward. Each element is touched once, so this is O(n).' },
          ],
        },
        {
          type: 'concept',
          heading: 'The fast/slow variation',
          body:
            'A second flavour moves both pointers in the same direction at different ' +
            'speeds. A "slow" pointer marks where the next kept element goes, while a ' +
            '"fast" pointer scans ahead. This is the standard way to remove duplicates ' +
            'or filter an array in place, again in a single O(n) pass.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Palindrome check with opposite-ends pointers — O(n) time, O(1) extra space.',
          code: 'def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        if s[left] != s[right]:\n            return False\n        left += 1\n        right -= 1\n    return True',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Using `while left <= right` when swapping ends.',
              fix: 'Use `left < right`. When they are equal they point at the same element — swapping it with itself is pointless (and for some problems, wrong).',
            },
            {
              mistake: 'Forgetting to move a pointer inside the loop.',
              fix: 'Every path through the loop must advance at least one pointer, or the condition never changes and the loop runs forever.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'For reversing an array with opposite-ends pointers, which loop condition is correct?',
          options: [
            'while left > right',
            'while left < right',
            'while left <= len(nums)',
            'while right > 0',
          ],
          answerIndex: 1,
          explanation:
            'The pointers start at the two ends and move inward; you keep swapping while ' +
            'left < right, and stop the moment they meet or cross.',
        },
        {
          type: 'summary',
          points: [
            'Two pointers replace many nested loops, turning O(n²) into O(n).',
            'Opposite-ends: start at both ends and move toward the middle.',
            'Fast/slow: both move the same way at different speeds — good for in-place filtering.',
            'Loop while left < right, and always advance a pointer each iteration.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What problem does the two-pointer pattern solve?', back: 'It replaces a nested loop with a single pass, often cutting O(n²) down to O(n).' },
        { front: 'Opposite-ends vs. fast/slow pointers?', back: 'Opposite-ends move toward each other from both sides; fast/slow move the same direction at different speeds (e.g. to filter in place).' },
        { front: 'Correct loop condition for reversing in place?', back: 'while left < right — stop once the pointers meet or cross.' },
      ],
      relatedLessonIds: ['arrays-sliding-window'],
    },

    // ── Lesson 4 ──────────────────────────────────────────────────────────
    {
      id: 'arrays-sliding-window',
      moduleId: 'arrays',
      title: 'The Sliding Window Pattern',
      subtitle: 'Reuse the last answer instead of recomputing it.',
      estimatedMinutes: 12,
      objectives: [
        'Recognise problems about contiguous subarrays or substrings',
        'Slide a fixed-size window in O(n) by adding one and dropping one',
        'Understand how a variable-size window grows and shrinks',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A window that glides across the array',
          body:
            'A sliding window is a contiguous range of the array that moves along it. ' +
            'Instead of recomputing a fresh answer for every window from scratch, you ' +
            'update the previous answer as the window moves: add the element entering ' +
            'on the right, remove the one leaving on the left. That reuse is what makes ' +
            'it fast.',
        },
        {
          type: 'analogy',
          source: 'A train window',
          body:
            'Looking out a moving train, the view shifts by one field at a time. You ' +
            'don’t re-survey the whole landscape at each moment — one new field appears ' +
            'on one side as one disappears on the other. A sliding window updates its ' +
            'contents exactly that incrementally.',
        },
        {
          type: 'concept',
          heading: 'Fixed vs. variable windows',
          body:
            'A fixed window has a constant width k and simply marches forward one step ' +
            'at a time — perfect for "best block of size k" questions. A variable window ' +
            'grows its right edge to include more, then shrinks its left edge when a ' +
            'constraint is violated — perfect for "longest/shortest range satisfying X" ' +
            'questions.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Max sum of any contiguous subarray of size k — one linear pass.',
          code: 'def max_sum_k(nums, k):\n    window = sum(nums[:k])   # sum of the first window\n    best = window\n    for i in range(k, len(nums)):\n        window += nums[i] - nums[i - k]  # add new, drop old\n        best = max(best, window)\n    return best',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Why this is O(n), not O(n·k)',
          body:
            'The naive approach recomputes each window’s sum from scratch: n windows × ' +
            'k additions each = O(n·k). The sliding window computes the first sum once, ' +
            'then does just one add and one subtract per step. That is O(k) up front plus ' +
            'O(n) for the pass — overall O(n). Each element is added once and removed ' +
            'once, so total work is proportional to n.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Rebuilding the window sum with sum(nums[i:i+k]) inside the loop.',
              fix: 'That hidden inner sum is O(k), dragging the whole thing back to O(n·k). Update incrementally: add the entering element, subtract the leaving one.',
            },
            {
              mistake: 'Forgetting to subtract the element that just left the window.',
              fix: 'Every element entering on the right has a matching element leaving on the left. Add one and drop one to keep the window the right width.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Why is the sliding-window max-sum O(n) rather than O(n·k)?',
          options: [
            'It sorts the array first',
            'It reuses the previous sum, doing one add and one subtract per step instead of re-summing k elements',
            'It only looks at every k-th element',
            'k is always small',
          ],
          answerIndex: 1,
          explanation:
            'Recomputing each window costs O(k) and there are n of them → O(n·k). Sliding ' +
            'updates the running sum in O(1) per step (add one, drop one), so the whole ' +
            'scan is O(n).',
        },
        {
          type: 'summary',
          points: [
            'A sliding window is a contiguous range that moves across the array.',
            'Update the running answer incrementally: add the entering element, drop the leaving one.',
            'Fixed windows keep width k; variable windows grow and shrink to meet a constraint.',
            'Reuse turns a naive O(n·k) recompute into a single O(n) pass.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a sliding window?', back: 'A contiguous range of the array that moves along it, updating its answer incrementally instead of recomputing.' },
        { front: 'How does the window stay O(n)?', back: 'Each step adds the entering element and subtracts the leaving one in O(1), so every element is added and removed once.' },
        { front: 'Fixed vs. variable window?', back: 'Fixed keeps a constant width k; variable grows its right edge and shrinks its left edge to satisfy a constraint.' },
      ],
      relatedLessonIds: ['strings-what-is-a-string'],
    },
  ],
};
