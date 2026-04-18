/**
 * Post (poste) model.
 * Each post is multifonctions: produces a resource, grants XP, emits an aura.
 * Upgrades scale active_slots, mentor_slots, and output.
 */

import type { ResourceId, SkillId, StatEffect } from './class';

/** Conditions to unlock a post. All listed conditions must be satisfied. */
export type UnlockCondition =
	| { kind: 'renown_tier'; tier: number }
	| { kind: 'resources'; cost: Record<ResourceId, number> }
	| { kind: 'class_discovered'; class_id: string }
	| { kind: 'action'; action_id: string };

export interface PostUpgrade {
	/** Level reached when this upgrade is applied (1-indexed). */
	level: number;
	cost: Record<ResourceId, number>;
	active_slots: number;
	mentor_slots: number;
	/** Multiplier on the post's base prod rate. */
	prod_mult: number;
	/** Optional extra aura effects unlocked at this level. */
	aura?: StatEffect[];
}

export interface PostDef {
	id: string;
	name: string;
	description: string;

	/** Main skill practiced at this post. null for special posts (Bureau du Chef, Salle de contrat). */
	skill: SkillId | null;
	/** Resource produced. null for aura-only or hub posts. */
	produces: ResourceId | null;

	/** Base rates at level 1, per hour, for one active merc with skill level 1. */
	base_prod_per_hour: number;
	base_xp_per_hour: number;

	/** Passive aura applied to the guild while manned. Scales with assigned merc's skill level. */
	aura: StatEffect[];

	unlock_conditions: UnlockCondition[];
	upgrades: PostUpgrade[];
}

export interface PostState {
	def_id: string;
	/** 0 = locked, 1 = unlocked and level 1, 2+ = upgraded. */
	level: number;
	/** Merc ids in active slots (length ≤ current upgrade.active_slots). */
	active_mercs: string[];
	/** Merc ids in mentor slots (length ≤ current upgrade.mentor_slots). */
	mentor_mercs: string[];
	/** Wall-clock timestamp when this post's state last changed (for segment math). */
	last_tick_at: number;
}
