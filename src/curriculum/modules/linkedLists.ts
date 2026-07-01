/**
 * Module 05 — Linked Lists
 *
 * The first pointer-based data structure. Trades the array's contiguous memory
 * and O(1) indexing for cheap insertion/deletion at a known position. Introduces
 * the mental model of nodes wired together by `next` pointers, then builds up to
 * traversal, editing, reversal, and Floyd's cycle-detection trick.
 *
 * Authored to match the canonical template (programmingBasics.ts) in shape,
 * block variety, and tone. Exercises the `linked-list` visual.
 */

import type { Module } from '../types';

export const linkedListsModule: Module = {
  id: 'linked-lists',
  order: 5,
  title: 'Linked Lists',
  tagline: 'Data wired together by pointers, not addresses.',
  overview:
    'An array keeps its items shoulder-to-shoulder in one block of memory. A ' +
    'linked list scatters them anywhere and threads them together with pointers ' +
    'instead. That single change flips the trade-offs: you lose instant index ' +
    'access but gain the power to splice items in and out without shifting ' +
    'everything else. This module builds the linked list from a single node up ' +
    'to the interview-favourite cycle-detection trick.',
  icon: 'link',
  difficulty: 'intermediate',
  prerequisites: ['arrays'],
  objectives: [
    'Describe a linked list as nodes joined by next pointers',
    'Traverse a list safely with a moving current pointer',
    'Reason about why insertion and deletion differ from arrays',
    'Reverse a list and detect a cycle in O(1) extra space',
  ],
  lessons: [
    // ── Lesson 1 ──────────────────────────────────────────────────────────
    {
      id: 'linked-lists-what-is-a-linked-list',
      moduleId: 'linked-lists',
      title: 'What Is a Linked List?',
      subtitle: 'Nodes, next pointers, and no contiguous memory.',
      estimatedMinutes: 8,
      objectives: [
        'Define a node as a value plus a pointer to the next node',
        'Explain how a list is held together without contiguous memory',
        'Contrast index access in arrays versus linked lists',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'A chain of nodes',
          body:
            'A linked list is a sequence of little containers called nodes. Each ' +
            'node holds two things: a value, and a pointer to the next node. Follow ' +
            'that pointer, and you land on the next node; follow its pointer, and so ' +
            'on until a node points at nothing (null), which marks the end. A single ' +
            'reference to the first node — the head — is all you keep; the rest of ' +
            'the list dangles off it.',
        },
        {
          type: 'analogy',
          source: 'A scavenger hunt',
          body:
            'Picture a scavenger hunt. Each clue tells you the location of the next ' +
            'clue, and nothing else. You only ever hold the current clue and know ' +
            'where the hunt starts. You cannot skip to the seventh clue — you must ' +
            'follow the trail from the beginning. A linked list works exactly like ' +
            'that: each node knows only where the next one lives.',
        },
        {
          type: 'visual',
          visual: {
            kind: 'linked-list',
            caption: 'Four nodes, each pointing to the next; the last points to null.',
            data: { nodes: ['3', '1', '4', '1'] },
          },
        },
        {
          type: 'concept',
          heading: 'Why no O(1) index access',
          body:
            'An array stores its items in one contiguous block, so the computer can ' +
            'jump straight to item number k by simple arithmetic — that is the O(1) ' +
            'index access you know. A linked list makes no such promise. Its nodes ' +
            'can live anywhere in memory, connected only by pointers, so to reach ' +
            'the kth node you must walk k steps from the head. There is no shortcut.',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'The trade you are making',
          body:
            'You give up instant index access and the tidy cache-friendliness of a ' +
            'contiguous array. In return you gain the ability to add or remove a ' +
            'node without shifting everything after it. Whether that trade is worth ' +
            'it depends entirely on what your code does most.',
        },
        {
          type: 'quiz',
          question: 'Why can’t you reach the 5th element of a linked list in O(1) time?',
          options: [
            'Linked lists can only hold four elements',
            'The nodes aren’t in contiguous memory, so you must follow pointers from the head',
            'Indexing a linked list requires converting it to an array first',
            'Pointers make every operation O(n²)',
          ],
          answerIndex: 1,
          explanation:
            'Nodes live anywhere in memory and are joined only by next pointers. ' +
            'With no contiguous block to compute an address from, reaching the kth ' +
            'node means walking k steps from the head — O(k).',
        },
        {
          type: 'summary',
          points: [
            'A linked list is nodes, each holding a value and a next pointer.',
            'You keep one reference — the head; the last node points to null.',
            'No contiguous memory means no O(1) index access; reaching the kth node is O(k).',
          ],
        },
      ],
      revisionCards: [
        { front: 'What is a node?', back: 'A container holding a value plus a pointer to the next node in the list.' },
        { front: 'What marks the end of a linked list?', back: 'A node whose next pointer is null (it points at nothing).' },
        { front: 'Why is index access not O(1) in a linked list?', back: 'Nodes aren’t contiguous, so you must follow next pointers from the head — O(k) to reach the kth node.' },
      ],
      relatedLessonIds: ['linked-lists-traversal'],
    },

    // ── Lesson 2 ──────────────────────────────────────────────────────────
    {
      id: 'linked-lists-traversal',
      moduleId: 'linked-lists',
      title: 'Traversal',
      subtitle: 'Walking the list with a current pointer.',
      estimatedMinutes: 8,
      objectives: [
        'Walk a list using a moving current pointer',
        'Stop cleanly when current becomes null',
        'Explain why traversal is O(n)',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Walk, don’t index',
          body:
            'Since you can’t jump to a position, you visit a linked list by walking ' +
            'it. Start a temporary pointer — call it current — at the head. Do ' +
            'whatever you need with current’s value, then advance current to ' +
            'current.next. Repeat until current is null, which means you have walked ' +
            'off the end. Crucially, you move the temporary pointer, never the head, ' +
            'so you don’t lose your grip on the start of the list.',
        },
        {
          type: 'analogy',
          source: 'A finger on a page',
          body:
            'It is like running your finger down a list, one line at a time. Your ' +
            'finger (current) moves; the top of the page (the head) stays put. When ' +
            'your finger slides past the last line into empty space, you know you’re ' +
            'done reading.',
        },
        {
          type: 'walkthrough',
          heading: 'Traversing to the end',
          language: 'python',
          steps: [
            { code: 'current = head', explanation: 'Start a temporary pointer at the first node. head itself never moves.' },
            { code: 'while current is not None:', explanation: 'Keep going as long as current points at a real node (not past the end).' },
            { code: '    print(current.value)', explanation: 'Do the work for this node — here, read its value.' },
            { code: '    current = current.next', explanation: 'Advance: follow this node’s pointer to the next node.' },
            { code: '# loop ends when current is None', explanation: 'The last node’s next is null, so current becomes None and the walk stops.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'Never advance the head',
          body:
            'Always traverse with a separate pointer (current), not the head itself. ' +
            'If you move the head forward, you lose the only reference to the start ' +
            'of the list — everything before current becomes unreachable garbage.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Reading current.value after current is already null.',
              fix: 'Check `while current is not None` before touching the node — a null node has no value to read.',
            },
            {
              mistake: 'Forgetting the `current = current.next` line, so the loop never moves.',
              fix: 'Every traversal loop must advance the pointer, or it spins forever on the first node.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'What condition ends a standard linked-list traversal?',
          options: [
            'When current.value equals zero',
            'When current becomes null (there is no next node)',
            'After exactly n iterations, counted in advance',
            'When the head pointer changes',
          ],
          answerIndex: 1,
          explanation:
            'You walk until current is null. The final node’s next pointer is null, ' +
            'so following it sets current to null and the loop stops — no need to ' +
            'know the length in advance.',
        },
        {
          type: 'summary',
          points: [
            'Traverse with a moving current pointer, starting at the head.',
            'Advance with current = current.next; stop when current is null.',
            'Never move the head; a full traversal visits every node once → O(n).',
          ],
        },
      ],
      revisionCards: [
        { front: 'How do you traverse a linked list?', back: 'Set current = head, then repeatedly do work and set current = current.next until current is null.' },
        { front: 'Why keep the head pointer fixed?', back: 'It’s the only reference to the start; moving it would lose access to the front of the list.' },
        { front: 'What is the time complexity of traversal?', back: 'O(n) — you visit each of the n nodes exactly once.' },
      ],
      relatedLessonIds: ['linked-lists-insertion-deletion'],
    },

    // ── Lesson 3 ──────────────────────────────────────────────────────────
    {
      id: 'linked-lists-insertion-deletion',
      moduleId: 'linked-lists',
      title: 'Insertion & Deletion',
      subtitle: 'Cheap to splice, costly to find.',
      estimatedMinutes: 10,
      objectives: [
        'Insert and delete at a known node in O(1)',
        'Explain why locating that node can cost O(n)',
        'Compare array and linked-list edit costs',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Rewiring is cheap',
          body:
            'This is where linked lists shine. To insert a new node after a node you ' +
            'already hold, you point the new node at whatever came next, then point ' +
            'the current node at the new node. Two pointer updates — done. Deletion ' +
            'is just as cheap: to remove the node after the one you hold, point ' +
            'around it (current.next = current.next.next). Nothing else in the list ' +
            'has to move.',
        },
        {
          type: 'analogy',
          source: 'Splicing a train',
          body:
            'Think of train carriages joined by couplings. To add a carriage in the ' +
            'middle, you unhook one coupling and re-hook two — the rest of the train ' +
            'stays exactly where it is. An array is more like numbered parking ' +
            'spaces: to squeeze a car into spot 3, every car behind it must shuffle ' +
            'down one space.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Insert a new node after `node` — two pointer updates, O(1).',
          code: 'new_node.next = node.next   # new node points to what came after\nnode.next = new_node        # node now points to the new node',
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'O(1) — once you’re there',
          body:
            'The splice itself is O(1), but only if you already hold the right node. ' +
            'If all you have is a value or a position, you must first traverse to ' +
            'find it — and that search is O(n). The cheap edit and the costly search ' +
            'are two separate costs; don’t conflate them.',
        },
        {
          type: 'complexity',
          heading: 'Array vs linked list, side by side',
          rows: [
            { operation: 'Access by index', time: 'O(1)', note: 'Array: direct address math. Linked list: O(n) — must walk from head.' },
            { operation: 'Insert / delete at a known node', time: 'O(1)', note: 'Linked list: rewire pointers. Array: O(n) — shift the tail.' },
            { operation: 'Insert / delete at the head', time: 'O(1)', note: 'Linked list: one pointer swap. Array: O(n) — everything shifts right.' },
            { operation: 'Search for a value', time: 'O(n)', note: 'Both scan linearly; neither can beat O(n) without extra structure.' },
          ],
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Setting node.next before saving the old node.next, losing the rest of the list.',
              fix: 'Point the new node at node.next FIRST, then repoint node.next. Order matters.',
            },
            {
              mistake: 'Claiming linked-list insertion is always O(1).',
              fix: 'The rewire is O(1); reaching the target node first can be O(n). State the assumption.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Inserting after a node you already hold a reference to is…',
          options: [
            'O(n), because the list must be shifted',
            'O(1), because it is just a couple of pointer updates',
            'O(log n), because the list halves',
            'Impossible without converting to an array',
          ],
          answerIndex: 1,
          explanation:
            'Given the node, insertion is two pointer assignments regardless of list ' +
            'length — O(1). No shifting happens because nodes aren’t contiguous. The ' +
            'O(n) cost only appears if you must first search for that node.',
        },
        {
          type: 'summary',
          points: [
            'Insert/delete at a known node is O(1): just rewire pointers.',
            'Finding that node first is O(n), since you must traverse.',
            'Arrays win on index access; linked lists win on splicing without shifting.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Cost of inserting after a known node?', back: 'O(1) — set new.next = node.next, then node.next = new. No shifting.' },
        { front: 'Why is deletion sometimes still O(n)?', back: 'The unlink is O(1), but locating the node (or its predecessor) can require an O(n) traversal.' },
        { front: 'Where does an array beat a linked list?', back: 'Index access: O(1) for arrays versus O(n) for linked lists.' },
      ],
      relatedLessonIds: ['linked-lists-reversal'],
    },

    // ── Lesson 4 ──────────────────────────────────────────────────────────
    {
      id: 'linked-lists-reversal',
      moduleId: 'linked-lists',
      title: 'Reversing a List',
      subtitle: 'The three-pointer prev / curr / next dance.',
      estimatedMinutes: 10,
      objectives: [
        'Flip every next pointer to reverse a list in place',
        'Track prev, curr, and next through the loop',
        'Explain why saving next first is essential',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'Flip the arrows',
          body:
            'Reversing a linked list means making every node point backward instead ' +
            'of forward. You do it in a single pass with three pointers: prev (the ' +
            'part already reversed, starting empty), curr (the node you’re flipping), ' +
            'and a temporary next (so you don’t lose the rest of the list the moment ' +
            'you flip curr’s pointer). Each step reverses one arrow, then slides all ' +
            'three pointers forward.',
        },
        {
          type: 'analogy',
          source: 'Turning a conga line around',
          body:
            'Everyone in a conga line has their hands on the shoulders ahead of them. ' +
            'To reverse the line, each person, one at a time, lets go of the front ' +
            'and grabs the person behind instead. Before letting go you must ' +
            'remember who was in front — otherwise you’d never find the rest of the ' +
            'line. That "remember who’s in front" step is the temporary next pointer.',
        },
        {
          type: 'walkthrough',
          heading: 'One step of the reversal',
          language: 'python',
          steps: [
            { code: 'prev = None', explanation: 'Nothing is reversed yet; the new list is empty, so prev starts as None.' },
            { code: 'curr = head', explanation: 'curr is the node we’re about to flip, beginning at the head.' },
            { code: 'while curr is not None:', explanation: 'Keep going until we’ve flipped every node.' },
            { code: '    next = curr.next', explanation: 'Save the rest of the list FIRST — the next line is about to overwrite curr.next.' },
            { code: '    curr.next = prev', explanation: 'Flip the arrow: curr now points backward at the already-reversed part.' },
            { code: '    prev = curr', explanation: 'Slide prev forward — curr is now the front of the reversed portion.' },
            { code: '    curr = next', explanation: 'Slide curr forward to the saved node and repeat. At the end, prev is the new head.' },
          ],
        },
        {
          type: 'callout',
          tone: 'warning',
          title: 'Save next before you flip',
          body:
            'The instant you run curr.next = prev, the original forward link is gone. ' +
            'If you didn’t stash it in next first, you’d have severed the list and ' +
            'lost every node after curr. The order of those two lines is the whole ' +
            'trick.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Flipping curr.next before saving curr.next into a temporary.',
              fix: 'Always do next = curr.next first; only then set curr.next = prev.',
            },
            {
              mistake: 'Returning head at the end instead of prev.',
              fix: 'After the loop curr is None and head is the old (now last) node; prev is the new head — return prev.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'In the reversal loop, why do we store `next = curr.next` before anything else?',
          options: [
            'To count how many nodes remain',
            'Because setting curr.next = prev destroys the forward link, so we must save it first',
            'To reverse the value stored in the node',
            'It is optional and only there for readability',
          ],
          answerIndex: 1,
          explanation:
            'curr.next = prev overwrites the pointer to the rest of the list. ' +
            'Saving it in next beforehand is the only way to keep hold of the ' +
            'remaining nodes and continue the walk.',
        },
        {
          type: 'summary',
          points: [
            'Reverse in one pass with three pointers: prev, curr, next.',
            'Each step: save next, flip curr.next to prev, then slide prev and curr forward.',
            'Save next before flipping, and return prev — the new head — at the end.',
          ],
        },
      ],
      revisionCards: [
        { front: 'Which three pointers reverse a linked list?', back: 'prev (reversed part), curr (node being flipped), and next (the saved remainder).' },
        { front: 'What are the two key lines inside the loop?', back: 'next = curr.next (save), then curr.next = prev (flip) — in that order.' },
        { front: 'What is the new head after reversal?', back: 'prev — it ends up pointing at the old last node, which is now first.' },
      ],
      relatedLessonIds: ['linked-lists-cycle-detection'],
    },

    // ── Lesson 5 ──────────────────────────────────────────────────────────
    {
      id: 'linked-lists-cycle-detection',
      moduleId: 'linked-lists',
      title: 'Cycle Detection',
      subtitle: 'Floyd’s fast and slow pointers.',
      estimatedMinutes: 11,
      objectives: [
        'Detect a cycle with two pointers of different speeds',
        'Explain why the fast pointer must catch the slow one',
        'Justify the O(n) time and O(1) space cost',
      ],
      blocks: [
        {
          type: 'concept',
          heading: 'When the trail loops back',
          body:
            'A linked list has a cycle if some node’s next pointer aims back at an ' +
            'earlier node, so a naive traversal never reaches null — it loops ' +
            'forever. Floyd’s algorithm finds such a cycle elegantly: run two ' +
            'pointers through the list, a slow one moving one node per step and a ' +
            'fast one moving two. If the list ends, fast reaches null — no cycle. If ' +
            'there is a loop, fast eventually laps slow and they land on the same ' +
            'node.',
        },
        {
          type: 'analogy',
          source: 'Runners on a track',
          body:
            'Two runners start together. One jogs, the other sprints at double the ' +
            'pace. On a straight road the sprinter simply finishes and leaves. But ' +
            'on a circular track the sprinter keeps gaining a lap and must, sooner ' +
            'or later, come up right behind the jogger. Meeting again can only ' +
            'happen if the track loops.',
        },
        {
          type: 'code',
          language: 'python',
          caption: 'Floyd’s cycle detection — O(n) time, O(1) space.',
          code: 'def has_cycle(head):\n    slow = head\n    fast = head\n    while fast is not None and fast.next is not None:\n        slow = slow.next          # one step\n        fast = fast.next.next      # two steps\n        if slow is fast:           # they met → cycle\n            return True\n    return False                   # fast hit the end → no cycle',
        },
        {
          type: 'callout',
          tone: 'insight',
          title: 'Why they must meet',
          body:
            'Once both pointers are inside the loop, each step closes the gap ' +
            'between them by exactly one node (fast gains two, slow gains one). A ' +
            'gap that shrinks by one every step can never skip past zero, so fast ' +
            'is guaranteed to land exactly on slow — no infinite chase.',
        },
        {
          type: 'complexity',
          heading: 'The cost',
          rows: [
            { operation: 'Time', time: 'O(n)', note: 'Slow advances one node per step and can’t be lapped more than once → linear.' },
            { operation: 'Space', time: 'O(1)', space: 'O(1)', note: 'Just two pointers — no extra set or map that grows with the list.' },
          ],
        },
        {
          type: 'callout',
          tone: 'tip',
          title: 'The obvious alternative, and its cost',
          body:
            'You could instead store every visited node in a hash set and watch for ' +
            'a repeat. That is also O(n) time but O(n) space. Floyd’s two-pointer ' +
            'trick gets the same answer with only two variables — O(1) space — which ' +
            'is why interviewers love it.',
        },
        {
          type: 'mistakes',
          items: [
            {
              mistake: 'Checking fast.next.next without first guarding fast and fast.next.',
              fix: 'Test `fast is not None and fast.next is not None` each iteration, or you’ll dereference null.',
            },
            {
              mistake: 'Comparing values (slow.value == fast.value) instead of identity.',
              fix: 'Compare the nodes themselves (slow is fast); two different nodes can share a value.',
            },
          ],
        },
        {
          type: 'quiz',
          question: 'Why is Floyd’s cycle detection O(1) space?',
          options: [
            'It copies the list into an array first',
            'It stores every visited node in a hash set',
            'It uses only two pointers, no structure that grows with the input',
            'It is actually O(n) space, not O(1)',
          ],
          answerIndex: 2,
          explanation:
            'The algorithm keeps just two pointers, slow and fast, no matter how ' +
            'long the list is. Nothing it stores grows with n, so the extra space is ' +
            'constant — O(1). The hash-set approach, by contrast, is O(n) space.',
        },
        {
          type: 'summary',
          points: [
            'A cycle means a next pointer loops back, so traversal never hits null.',
            'Floyd runs a slow (1×) and fast (2×) pointer; meeting means a cycle exists.',
            'The gap shrinks by one each step, guaranteeing a meeting: O(n) time, O(1) space.',
          ],
        },
      ],
      revisionCards: [
        { front: 'How does Floyd’s algorithm detect a cycle?', back: 'Move a slow pointer one step and a fast pointer two steps; if they ever meet, there is a cycle.' },
        { front: 'Time and space of Floyd’s cycle detection?', back: 'O(n) time, O(1) space — just two pointers, no growing structure.' },
        { front: 'Why must the pointers meet inside a loop?', back: 'Fast closes the gap to slow by exactly one node per step, so it can’t skip past — they collide.' },
      ],
      relatedLessonIds: ['stacks-what-is-a-stack'],
    },
  ],
};
