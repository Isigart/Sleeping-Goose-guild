/**
 * Class (compendium entry) model.
 * Every class carries BOTH active_stats and mentor_stats from V1,
 * because mentorship ships in V1.
 */

export type SkillId = string;
export type ResourceId = string;

/** Effect applied by a mentor's buff or an active class's stats. */
export type StatEffect =
	| { kind: 'prod_rate_mult'; resource: ResourceId; value: number }
	| { kind: 'xp_rate_mult'; skill: SkillId; value: number }
	| { kind: 'role_stat_add'; role: string; stat: string; value: number }
	| { kind: 'flat_resource_per_hour'; resource: ResourceId; value: number }
	| { kind: 'aura_mult'; aura_id: string; value: number };

/** XP thresholds on a skill combo required to unlock this class. */
export interface ClassUnlock {
	/** Map of skill id → cumulative XP required. Merc must satisfy ALL. */
	xp_thresholds: Record<SkillId, number>;
	/** Optional additional constraints (trait, class prerequisite, etc.). */
	requires?: {
		class?: string;
		trait?: string;
	};
}

export interface ClassDef {
	id: string;
	name: string;
	description: string;
	icon?: string;

	lineage: string;
	tier: number;

	unlock: ClassUnlock;

	/** Effects while the merc is active with this class. */
	active_stats: StatEffect[];
	/** Effects while the merc is a mentor with this class. Fixed at conversion. */
	mentor_stats: StatEffect[];
}
