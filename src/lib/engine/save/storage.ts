/**
 * Save system.
 *
 * Requirements from README:
 * - Never lose user data. Fallback to last healthy save on the slightest doubt.
 * - localStorage in V1. Migration path to IndexedDB / backend in V3.
 * - Versioned payloads to allow migrations.
 */

const SAVE_KEY = 'sgg.save.v1';
const BACKUP_KEY = 'sgg.save.v1.backup';

export interface SavePayload {
	/** Schema version. Bump on any shape change + add a migration. */
	version: number;
	/** Wall-clock timestamp of the save. */
	saved_at: number;
	/** Opaque game state. Shape defined by the engine. */
	state: unknown;
}

export const CURRENT_VERSION = 1;

function safeGetItem(key: string): string | null {
	try {
		return globalThis.localStorage?.getItem(key) ?? null;
	} catch {
		return null;
	}
}

function safeSetItem(key: string, value: string): boolean {
	try {
		globalThis.localStorage?.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}

/**
 * Load the main save. Falls back to backup if main is corrupt.
 * Returns null if nothing saved yet.
 */
export function loadSave(): SavePayload | null {
	for (const key of [SAVE_KEY, BACKUP_KEY]) {
		const raw = safeGetItem(key);
		if (!raw) continue;
		try {
			const parsed = JSON.parse(raw) as SavePayload;
			if (
				typeof parsed === 'object' &&
				parsed !== null &&
				typeof parsed.version === 'number' &&
				typeof parsed.saved_at === 'number'
			) {
				return parsed;
			}
		} catch {
			// fall through to backup
		}
	}
	return null;
}

/**
 * Save state. Rotates the previous main save to backup first,
 * so a write failure can't destroy the last healthy state.
 */
export function writeSave(state: unknown): boolean {
	const prev = safeGetItem(SAVE_KEY);
	if (prev) safeSetItem(BACKUP_KEY, prev);

	const payload: SavePayload = {
		version: CURRENT_VERSION,
		saved_at: Date.now(),
		state
	};
	return safeSetItem(SAVE_KEY, JSON.stringify(payload));
}

/** Wipe both main and backup. Intended for debug / hard reset. */
export function clearSave(): void {
	try {
		globalThis.localStorage?.removeItem(SAVE_KEY);
		globalThis.localStorage?.removeItem(BACKUP_KEY);
	} catch {
		// noop
	}
}
