import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSave, loadSave, writeSave } from './storage';

class MemStorage {
	private data = new Map<string, string>();
	getItem(k: string): string | null {
		return this.data.get(k) ?? null;
	}
	setItem(k: string, v: string): void {
		this.data.set(k, v);
	}
	removeItem(k: string): void {
		this.data.delete(k);
	}
	clear(): void {
		this.data.clear();
	}
}

beforeEach(() => {
	vi.stubGlobal('localStorage', new MemStorage());
});

describe('save system', () => {
	it('returns null when nothing is saved', () => {
		expect(loadSave()).toBeNull();
	});

	it('round-trips a payload', () => {
		writeSave({ hello: 'world' });
		const loaded = loadSave();
		expect(loaded).not.toBeNull();
		expect(loaded?.state).toEqual({ hello: 'world' });
	});

	it('falls back to backup when main save is corrupt', () => {
		writeSave({ n: 1 });
		writeSave({ n: 2 });
		(globalThis.localStorage as unknown as MemStorage).setItem('sgg.save.v1', '{ not json');
		const loaded = loadSave();
		expect(loaded?.state).toEqual({ n: 1 });
	});

	it('clearSave removes main and backup', () => {
		writeSave({ n: 1 });
		writeSave({ n: 2 });
		clearSave();
		expect(loadSave()).toBeNull();
	});
});
