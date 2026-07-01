/**
 * Curriculum Icon Registry
 *
 * Maps the semantic `CurriculumIcon` names used in content to concrete lucide
 * components. This is the single place UI icon choices for modules live, so
 * content files never import from the UI layer.
 */

import {
  Terminal,
  Gauge,
  Brackets,
  Type,
  Link2,
  Layers,
  Hash,
  TreePine,
  Network,
  Repeat,
  Binary,
  Boxes,
  BookOpen,
  type LucideIcon,
} from 'lucide-react-native';

import type { CurriculumIcon } from './types';

const ICONS: Record<CurriculumIcon, LucideIcon> = {
  terminal: Terminal,
  gauge:    Gauge,
  brackets: Brackets,
  type:     Type,
  link:     Link2,
  layers:   Layers,
  hash:     Hash,
  tree:     TreePine,
  network:  Network,
  repeat:   Repeat,
  binary:   Binary,
  boxes:    Boxes,
};

/** Resolve a curriculum icon name to a lucide component, with a safe fallback. */
export function getCurriculumIcon(name: CurriculumIcon): LucideIcon {
  return ICONS[name] ?? BookOpen;
}
