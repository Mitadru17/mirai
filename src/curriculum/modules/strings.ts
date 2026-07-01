/**
 * Module 04 — Strings
 *
 * Text is data too. Building on arrays, this module treats a string as an
 * ordered sequence of characters: how to index into it, why many languages
 * make it immutable (and what that costs), and the classic beginner patterns —
 * anagrams, palindromes, and building strings efficiently. Exercises the
 * `string` character-cell visual.
 *
 * Follows programmingBasics.ts as the canonical template for shape and tone.
 */

import type { Module } from '../types';

export const stringsModule: Module = {
  id: 'strings',
  order: 4,
  title: 'Strings',
  tagline: 'Working with text, one character at a time.',
  overview:
    'Almost every program touches text: names, messages, file paths, search ' +
    'queries. Under the hood a string is just an ordered sequence of characters — ' +
    'a lot like the arrays you just met. This module shows how to index into ' +
    'text, why so many languages make strings immutable (and the sneaky O(n²) ' +
    'trap that follows), and the frequency-counting and two-pointer patterns ' +
    'that solve a huge share of beginner string problems.',
  icon: 'type',
  difficulty: 'beginner',
  prerequisites: ['arrays'],
  objectives: [
    'Describe a string as an indexed sequence of characters and read any position',
    'Explain immutability and why looping concatenation is O(n²)',
    'Solve anagram and palindrome problems with counting and two pointers',
    'Build strings efficiently by collecting parts and joining once',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'strings-what-is-a-string',
      moduleId: 'strings',
      title: 'What Is a String?',
      subtitle: 'A sequence of characters you can index.',
      estimatedMinutes: 7,
      objectives: [
        'Define a string as an ordered sequence of characters',
        'Read a character by its zero-based index and get the length',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A string is text, laid out in order',
          body:
            'A string is a sequence of characters kept in order — much like an ' +
            'array, but every cell holds a single character. Because the order is ' +
            'fixed, each character has a position, called its index. Just like ' +
            'arrays, indexing starts at 0: the first character is at index 0, the ' +
            'second at index 1, and so on.',
        },
        {
          type: 'analogy',
          source: 'Beads on a string',
          body:
            'Picture beads threaded on a string, each bead a letter. To find the ' +
            'third bead you count from the first — you don’t rummage the whole ' +
            'thread. Text works the same way: give the computer an index and it ' +
            'jumps straight to that character.',
        },
        {
          type: 'visual',
          visual: {
            kind: 'string',
            caption: 'Each character sits in its own cell, labelled by its index.',
            data: {
              text: 'MIRAI',
              highlight: 0,
            },
          },
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Indexing reads one character; len measures the whole string.',
          code: 'word = "MIRAI"\nprint(word[0])    # M  (first character, index 0)\nprint(word[4])    # I  (last character, index 4)\nprint(len(word))  # 5  (number of characters)',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'The last index is length − 1',
          body:
            'A string of length 5 has valid indices 0, 1, 2, 3, 4 — the final ' +
            'character lives at len − 1, not len. Asking for word[5] here would run ' +
            'off the end and raise an error.',
        },
        {
          type: 'quiz',
          question: 'In the string "MIRAI", which index holds the character "R"?',
          options: ['1', '2', '3', 'R has no index'],
          answerIndex: 1,
          explanation:
            'Indexing starts at 0: M=0, I=1, R=2, A=3, I=4. So "R" is at index 2.',
        },
        {
          type: 'summary',
          points: [
            'A string is an ordered sequence of characters, indexed from 0.',
            'word[i] reads the character at position i.',
            'len(word) gives the count; the last valid index is len − 1.',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a string?', back: 'An ordered sequence of characters, each addressable by a zero-based index.' },
        { front: 'Where does the last character of a length-n string live?', back: 'At index n − 1, because indexing starts at 0.' },
      ],
      relatedLessonIds: ['strings-immutability'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'strings-immutability',
      moduleId: 'strings',
      title: 'Immutability & Cost',
      subtitle: 'Why editing text can be quietly expensive.',
      estimatedMinutes: 9,
      objectives: [
        'Explain what it means for a string to be immutable',
        'Recognise why concatenating in a loop is O(n²)',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Many strings can’t be changed in place',
          body:
            'In languages like Python, Java, and JavaScript, strings are immutable: ' +
            'once created, a string’s characters never change. Operations that look ' +
            'like edits — adding a character, replacing a letter — don’t modify the ' +
            'original. They build a brand-new string and leave the old one untouched.',
        },
        {
          type: 'analogy',
          source: 'Retyping a page',
          body:
            'Imagine a page written in permanent ink. To "add" a word you can’t ' +
            'squeeze it in — you copy the whole page onto a fresh sheet with the new ' +
            'word included. One extra word means recopying everything already there.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Each += copies the whole result so far into a new string.',
          code: 'result = ""\nfor ch in "MIRAI":\n    result = result + ch   # builds a NEW string every time\nprint(result)              # MIRAI',
        },
        {
          type: 'concept',
          heading: 'Why the loop becomes O(n²)',
          body:
            'On each pass the whole current string is copied to make the new one. ' +
            'Copy 1 character, then 2, then 3, up to n. Those copies add up to ' +
            '1 + 2 + 3 + … + n, which is about n²/2 total work — so building an ' +
            'n-character string this way is O(n²), not the O(n) you might expect.',
        },
        {
          type: 'complexity',
          heading: 'The cost of naive concatenation',
          rows: [
            { operation: 'Read a character by index', time: 'O(1)', note: 'Jump straight to the position.' },
            { operation: 'One concatenation a + b', time: 'O(n)', space: 'O(n)', note: 'Copies both parts into a new string.' },
            { operation: 'Concatenate in a loop (n times)', time: 'O(n²)', space: 'O(n)', note: 'Recopies the growing result each pass.' },
          ],
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Building a long string with `s = s + piece` inside a loop.',
              fix: 'Each += copies the whole string so far — that’s O(n²). Collect pieces in a list and join once (next lessons cover how).',
            },
            {
              mistake: 'Trying to edit a character in place, e.g. `s[0] = "X"`.',
              fix: 'Immutable strings forbid this. Build a new string instead, such as "X" + s[1:].',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Why is concatenating one character at a time in a loop O(n²)?',
          options: [
            'Loops are always O(n²)',
            'Each concatenation copies the whole growing string, and those copies sum to about n²',
            'Strings store their length in n² bytes',
            'It is actually O(n), not O(n²)',
          ],
          answerIndex: 1,
          explanation:
            'Because strings are immutable, every += rebuilds the whole result. ' +
            'Copying 1 + 2 + … + n characters totals roughly n²/2 → O(n²).',
        },
        {
          type: 'summary',
          points: [
            'Immutable strings can’t be changed in place; edits create new strings.',
            'One concatenation is O(n) because it copies both parts.',
            'Concatenating in a loop repeats that copy and becomes O(n²).',
          ],
        },
      ],
      revisionCards: [
        { front: 'What does "immutable" mean for a string?', back: 'Its characters can’t change after creation; any "edit" produces a new string.' },
        { front: 'Why is loop concatenation O(n²)?', back: 'Each += copies the whole growing string; the copies sum to about n²/2.' },
        { front: 'How do you "change" a character in an immutable string?', back: 'You can’t edit in place — build a new string, e.g. "X" + s[1:].' },
      ],
      relatedLessonIds: ['strings-patterns'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'strings-patterns',
      moduleId: 'strings',
      title: 'Anagrams & Palindromes',
      subtitle: 'Two patterns that unlock many string problems.',
      estimatedMinutes: 11,
      objectives: [
        'Check whether two strings are anagrams using frequency counting',
        'Check whether a string is a palindrome with two pointers',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Count characters to compare content',
          body:
            'Two words are anagrams when they use exactly the same characters, just ' +
            'reordered — like "listen" and "silent". Sorting both and comparing works ' +
            'but costs O(n log n). Counting how many times each character appears is ' +
            'faster: tally both strings, then check the tallies match. That’s O(n).',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Frequency counting decides anagrams in one linear pass each.',
          code: 'from collections import Counter\n\ndef is_anagram(a, b):\n    return Counter(a) == Counter(b)\n\nprint(is_anagram("listen", "silent"))  # True\nprint(is_anagram("hello", "world"))    # False',
        },
        {
          type: 'concept',
          heading: 'Walk inward from both ends',
          body:
            'A palindrome reads the same forwards and backwards, like "level" or ' +
            '"radar". The two-pointer trick puts one pointer at the start and one at ' +
            'the end, compares the characters, then steps both inward. If any pair ' +
            'differs it’s not a palindrome; if the pointers meet, it is.',
        },
        {
          type: 'walkthrough',
          heading: 'Two-pointer palindrome check on "radar"',
          language: 'python',
          steps: [
            { code: 'left, right = 0, len(s) - 1', explanation: 'Start one pointer at index 0 and the other at the last index (4 for "radar").' },
            { code: 'while left < right:', explanation: 'Keep going while the pointers haven’t crossed or met in the middle.' },
            { code: '    if s[left] != s[right]:', explanation: 'Compare the outer pair. For "radar": r==r, then a==a — every pair matches.' },
            { code: '        return False', explanation: 'Any mismatched pair means it can’t be a palindrome, so stop early.' },
            { code: '    left, right = left + 1, right - 1', explanation: 'Move both pointers one step toward the centre and compare the next pair.' },
            { code: 'return True', explanation: 'The pointers met without a mismatch, so "radar" is a palindrome.' },
          ],
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Two pointers touch each character once',
          body:
            'The pointers together cover the whole string exactly once, so the check ' +
            'is O(n) time and O(1) extra space — no second copy of the string needed.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Looping to the end (left <= right) and comparing the middle char to itself.',
              fix: 'Use left < right. When the pointers meet on the centre character there is nothing left to compare.',
            },
            {
              mistake: 'Forgetting case or spaces, so "Level" or "race car" is judged unfairly.',
              fix: 'Normalise first if the problem asks for it: lowercase and strip non-letters before checking.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Why can an anagram check run in O(n) instead of O(n log n)?',
          options: [
            'Because sorting is always slow',
            'Counting each character’s frequency avoids sorting and needs just one pass per string',
            'Because anagrams are always short',
            'It cannot — it is always O(n log n)',
          ],
          answerIndex: 1,
          explanation:
            'Tallying character counts is a single linear pass per string, so the ' +
            'comparison is O(n). Sorting-then-comparing would add an O(n log n) step.',
        },
        {
          type: 'summary',
          points: [
            'Anagrams share the same character counts — compare frequencies in O(n).',
            'A palindrome reads the same both ways.',
            'Two pointers from both ends check a palindrome in O(n) time, O(1) space.',
          ],
        },
      ],
      revisionCards: [
        { front: 'How do you check if two strings are anagrams in O(n)?', back: 'Count each character’s frequency in both strings and compare the counts.' },
        { front: 'What is the two-pointer palindrome check?', back: 'Compare characters from both ends moving inward; mismatch → not a palindrome, pointers meet → it is.' },
        { front: 'Time and space of the two-pointer palindrome check?', back: 'O(n) time and O(1) extra space — each character is visited once.' },
      ],
      relatedLessonIds: ['strings-building'],
    },

    // ── Lesson 4 ──────────────────────────────────────────────────────────
    {
      id: 'strings-building',
      moduleId: 'strings',
      title: 'Building Strings Efficiently',
      subtitle: 'Collect the parts, then join once.',
      estimatedMinutes: 9,
      objectives: [
        'Avoid the O(n²) trap of looping concatenation',
        'Build strings with a list buffer and a single join',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Gather first, stitch last',
          body:
            'The fix for the immutability tax is simple: don’t grow a string piece ' +
            'by piece. Append each part to a list (which can grow cheaply), then ' +
            'combine them all in one final join. The join walks the parts a single ' +
            'time, so the whole build is O(n) instead of O(n²).',
        },
        {
          type: 'analogy',
          source: 'Collecting bricks before building',
          body:
            'Instead of mixing fresh mortar for every single brick, you stack all ' +
            'the bricks first, then lay the wall in one go. Collecting the pieces up ' +
            'front and assembling once avoids endlessly redoing the same work.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Same result, very different cost: O(n²) build vs O(n) join.',
          code: '# Slow: recopies the whole string every pass -> O(n^2)\nresult = ""\nfor ch in chars:\n    result = result + ch\n\n# Fast: collect in a list, join once -> O(n)\nparts = []\nfor ch in chars:\n    parts.append(ch)   # appends are cheap\nresult = "".join(parts)  # single pass over all pieces',
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'join is your default',
          body:
            'Whenever you’re assembling text from many pieces — words into a ' +
            'sentence, rows into a report — reach for a list plus "".join(...) or ' +
            '" ".join(...). It’s both faster and clearer than a growing +=.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Reaching for += concatenation out of habit for large builds.',
              fix: 'Default to a list buffer and one join; keep += only for a couple of fixed pieces.',
            },
            {
              mistake: 'Calling join on a list that contains non-strings, e.g. numbers.',
              fix: 'join needs strings. Convert first: "".join(str(x) for x in values).',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'What is the time complexity of building an n-character string with a list buffer and a single join?',
          options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
          answerIndex: 2,
          explanation:
            'Appends are cheap and the single join makes one pass over all the ' +
            'pieces, so the total work is linear — O(n).',
        },
        {
          type: 'summary',
          points: [
            'Looping += concatenation is O(n²) because of repeated copying.',
            'Append pieces to a list, then join once, for O(n) total work.',
            'Prefer "".join(parts) as the default way to assemble text.',
          ],
        },
      ],
      revisionCards: [
        { front: 'How do you build a big string efficiently?', back: 'Append the pieces to a list, then combine them once with "".join(list).' },
        { front: 'Why is the list-and-join approach O(n)?', back: 'Appends are cheap and the single join makes just one pass over all pieces.' },
      ],
      relatedLessonIds: ['linked-lists-what-is-a-linked-list'],
    },
  ],
};
