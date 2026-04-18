/**
 * Journal events. Typed with a template key so V2/V3 can add event kinds
 * without touching the core. UI picks a template by `template_key`.
 */

export interface JournalEvent<T extends string = string, D = Record<string, unknown>> {
	id: string;
	type: T;
	timestamp: number;
	template_key: string;
	data: D;
}

export type AnyJournalEvent = JournalEvent;
