/**
 * Unified resource model.
 * V1: currency (or/bois/pierre) + reputation (renommée). V2+: rare_token.
 * Structure must let us add resources at runtime without refactor.
 */

export type ResourceType = 'currency' | 'reputation' | 'rare_token';

export interface Resource {
	id: string;
	type: ResourceType;
	/** Current amount. Integer for rare_token, float allowed for others. */
	current: number;
	/** Optional cap. null = uncapped. */
	max: number | null;
}

export function makeResource(init: {
	id: string;
	type: ResourceType;
	current?: number;
	max?: number | null;
}): Resource {
	return {
		id: init.id,
		type: init.type,
		current: init.current ?? 0,
		max: init.max ?? null
	};
}
