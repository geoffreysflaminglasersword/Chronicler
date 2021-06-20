import { KEY, ObsidianEvent, Plugin, Scope } from './common';

import { KeymapEventListener, Modifier } from 'obsidian';

export const rxLastWord = /(?:(?<=\s)(\S+?)|(\s))?$/; // if last char is space, matches only the space
export function regexIndexOf(string: string, regex: RegExp, startpos: number) {
    var indexOf = string.substring(startpos || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}


export function nth(n: number) { return String(n) + (['', 'st', 'nd', 'rd'][n / 10 % 10 ^ 1 && n % 10] || 'th'); }
export function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
export function monthName(n: number) {
    const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    return months[n];
}



export function wrap(num: number, max: number): number {
    return (max + (num % max)) % max;
}
export function hasDuplicates<T>(arr: Array<T>) {
    return new Set(arr).size !== arr.length;
}

export type MakeIterable<T> = { [K in keyof T]: Iterable<T[K]> };

export function* zip<T extends Array<any>>(...toZip: MakeIterable<T>): Generator<T> {
    const iterators = toZip.map(i => i[Symbol.iterator]());
    while (true) {
        const results = iterators.map(i => i.next());
        if (results.some(({ done }) => done)) break;
        yield results.map(({ value }) => value) as T;
    }
}



declare global {
    interface Function {
        multi<T extends any[]>(...args: T): void;
    }
}

Function.prototype.multi = function <T extends any[]>(...args: T) {
    args.forEach((v) => (<Function>this).call(v));
};


interface KeyEventRegistrant { mods: Modifier[]; key: KEY; func: KeymapEventListener; }
interface EventRegistrant { ev: string; func: any; }

function register(
    scope?: Scope,
    keyEvs?: KeyEventRegistrant[],
    plugin?: Plugin,
    evs?: EventRegistrant[]) {
    let kevs = keyEvs?.map((i) => scope.register(i.mods, i.key, i.func));
    evs?.forEach((v) => plugin.registerCodeMirror((cm) => cm.on(v.ev, v.func)));
    return () => {
        kevs?.forEach((keh) => scope.unregister(keh));
        evs?.forEach((v) => plugin.registerCodeMirror((cm) => cm.off(v.ev, v.func)));
    };
}

export function Register(
    scope?: Scope,
    keyEvs?: (Modifier[] | KEY | KeymapEventListener)[][],
    plugin?: Plugin,
    evs?: (ObsidianEvent | Function)[][]) {
    if ((scope ? !keyEvs : keyEvs) || (plugin ? !evs : evs)) {
        throw new Error('In Utils::Register');
    };
    return register(
        scope,
        keyEvs?.map((v) => { return { mods: v[0] as Modifier[], key: v[1] as KEY, func: v[2] as KeymapEventListener }; }),
        plugin,
        evs?.map((v) => { return { ev: v[0] as ObsidianEvent, func: v[1] }; })
    );
}








