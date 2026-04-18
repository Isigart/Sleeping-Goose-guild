/**
 * Merc model.
 * V1 only uses `salary`, but all need fields exist (null/0 until V2).
 * `classes` is an array even in V1 where only one class is active.
 */

import type { SkillId } from './class';

export type MercStatus = 'active' | 'mentor';

export interface MercNeeds {
	/** V1: amount of currency per pay cycle. */
	salary: number;
	/** V2: food ration required per cycle. null in V1. */
	food: number | null;
	/** V2: care/moral upkeep. null in V1. */
	care: number | null;
}

export interface MercSkill {
	id: SkillId;
	/** Cumulative XP. Level is derived. */
	xp: number;
}

export interface MercTrait {
	id: string;
	/** Optional numeric modifier payload — cosmetic traits have none. */
	modifier?: Record<string, number>;
}

export interface Merc {
	id: string;
	name: string;

	status: MercStatus;

	/** Class ids this merc has unlocked/acquired. Active class for the merc is `classes[0]` in V1. */
	classes: string[];

	skills: Record<SkillId, MercSkill>;
	traits: MercTrait[];
	needs: MercNeeds;

	/** Post id where merc is assigned (active or mentor slot). null = idle. */
	assigned_post: string | null;
	/** Slot type within the post. */
	assigned_slot: 'active' | 'mentor' | null;

	/** Timestamp of hire (ms). */
	hired_at: number;
	/** true for the chief only. Chief is a distinct entity in practice
	 * (immortal, indémissionnable, no compendium class), but we keep
	 * it on the same type to avoid branching. */
	is_chief: boolean;
}

export function makeMerc(init: {
	id: string;
	name: string;
	is_chief?: boolean;
	salary?: number;
}): Merc {
	return {
		id: init.id,
		name: init.name,
		status: 'active',
		classes: [],
		skills: {},
		traits: [],
		needs: {
			salary: init.salary ?? 0,
			food: null,
			care: null
		},
		assigned_post: null,
		assigned_slot: null,
		hired_at: Date.now(),
		is_chief: init.is_chief ?? false
	};
}
