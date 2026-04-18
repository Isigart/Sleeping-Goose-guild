/**
 * Contract model.
 * Contracts are autonomous entities. `taken_by` is always 'player' in V1,
 * but can be a guild id in V3 — do not hardcode the player assumption.
 */

import type { ResourceId, SkillId, StatEffect } from './class';

/** Canonical roles. V1 = 3. V2 adds 'scout' | 'caster'. */
export type RoleId = 'tank' | 'dps' | 'support' | (string & {});

/** Tolerance on a requirement. */
export type RequirementTolerance = 'strict' | 'flexible' | 'substitutable';

/** One typed requirement on a contract. */
export type Requirement =
	| {
			kind: 'role_stat';
			role: RoleId;
			skill: SkillId;
			threshold: number;
			tolerance: RequirementTolerance;
	  }
	| {
			kind: 'class';
			class_id: string;
			tolerance: RequirementTolerance;
	  }
	| {
			kind: 'trait';
			trait_id: string;
			tolerance: RequirementTolerance;
	  }
	| {
			kind: 'profession';
			/** e.g. a merc with a specific non-combat skill above threshold */
			skill: SkillId;
			threshold: number;
			tolerance: RequirementTolerance;
	  };

export interface ContractReward {
	/** Currency per hour while assigned. */
	per_hour: Record<ResourceId, number>;
	/** XP per hour granted to assigned mercs, per skill. */
	xp_per_hour: Partial<Record<SkillId, number>>;
	/** Aura effects applied while the contract is active. */
	effects?: StatEffect[];
}

export interface ContractDef {
	id: string;
	name: string;
	zone_id: string;
	description: string;

	requirements: Requirement[];
	reward: ContractReward;

	/** null = no expiry. Otherwise duration in hours. */
	duration_hours: number | null;
}

export interface ContractState {
	def_id: string;
	/** 'player' in V1. A guild id in V3. Never hardcode 'player' assumption. */
	taken_by: string | null;
	assigned_mercs: string[];
	accepted_at: number | null;
}
