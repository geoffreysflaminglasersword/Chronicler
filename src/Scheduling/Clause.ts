import * as DU from 'src/Utils';
import * as chrono from 'chrono-node';
import * as moment from 'moment';

import { hasDuplicates, zip } from 'src/Utils';

import { ParsingComponents } from 'chrono-node/dist/results';
import RRule from 'rrule';
import { TFromArray } from 'src/common';
import { eHOLIDAY } from 'src/Scheduling/holidays';

//TODO: add clauses: before, after, remind
export const CLAUSES = ["starting", "ending", "every"] as const;
export const META_CLAUSES = ["except", "include"] as const;
export const ALL_CLAUSES = [...CLAUSES, ...META_CLAUSES] as const;
export const ALT_CLAUSES = ['until', 'beginning'];

export const RELATIVE = ['next', 'last', 'this'] as const;

export const INFORMAL_QUANTIFIERS = ['couple', 'few', 'several', 'other', 'back'] as const;
export const UNIT_QUANTIFIERS = ['dozen'] as const;
export const DATE_QUANTIFIERS = ['decade', 'century', 'millenium'] as const;
export const ALL_QUANTIFIERS = [...INFORMAL_QUANTIFIERS, ...UNIT_QUANTIFIERS, ...DATE_QUANTIFIERS] as const;


export const RECURRANCES = [
    'hourly', 'daily', 'biweekly', 'weekly', 'semi-monthly', 'bi-monthly',
    'monthly', 'semi-annually', 'annually', 'bi-ennially', 'semi-decennially',
    'bi-decennially', 'decennially', 'semi-centennially', 'bi-centennially',
    'centennially', 'millenially'
] as const;

export const MULTI = ['weekday', 'workday', 'weekend'] as const;

export const NEEDS_REPLACE = [...ALL_QUANTIFIERS, ...ALT_CLAUSES, ...RECURRANCES] as const;
export const ALL_KEYWORDS = [...ALL_CLAUSES, 'next', 'last', 'this'] as const;

export const ANY_CLAUSE: string = (() => { let s: string = ''; for (let i of CLAUSES) s += i + '|'; return s.slice(0, -1); })();
export const ANY_META: string = (() => { let s: string = ''; for (let i of META_CLAUSES) s += i + '|'; return s.slice(0, -1); })();
export const ANY_ALL_CLAUSE: string = (() => { let s: string = ''; for (let i of ALL_CLAUSES) s += i + '|'; return s.slice(0, -1); })();
export const ANY: string = (() => { let s: string = ''; for (let i of ALL_KEYWORDS) s += i + '|'; return s.slice(0, -1); })();

// type Greeble = { match: RegExp, replace: string; };

type REPS = typeof NEEDS_REPLACE[number];
const MATCHERS: Record<REPS, [RegExp, string]> = {
    couple: [/ (?:a )?couple /gim, ''],
    few: [/ (?:a )?few /gim, ''],
    several: [/ several /gim, ''],
    dozen: [/ (?:a )?dozen /gim, ''],
};


export enum E {
    BOTH = 0,
    TYPES = 1,
    CLAUSES = 2,
}



export function GetClauses(input: string, clauseMatcher: string, includeType = E.BOTH): string[] {
    let splitter: string = '(?<!(?:' + clauseMatcher + ') )(' + clauseMatcher + ')'; // splits clauses but ignores double clauses, e.g. 'every starting'
    let res = input.split(new RegExp(splitter, 'ig'));
    res.shift(); // first result after split is always unnecessary
    if (includeType == E.CLAUSES) res = res.filter((_, idx) => { return idx % 2 === 1; }); // odd indices are the clauses
    if (includeType == E.TYPES) res = res.filter((_, idx) => { return idx % 2 === 0; }); // even indices are the types
    // console.log(res);
    return res;
}

class Clause {
    public isRecurrent: boolean;
    public parseResults: chrono.ParsedResult[];
    public parsedDate: Date;

    protected details: any[] = new Array();
    private _clause: string;
    private _rruleVersion: string;
    private ass = (e: CustomEvent) => { this.details.push(e.detail); };

    public get clause(): string { return this._clause; }
    public get rruleVersion(): string { return 'every ' + this._rruleVersion; }

    constructor(recurrent = false) { this.isRecurrent = recurrent; }

    public setClause(value: string): void {
        this._clause = value.trim();

        addEventListener(eHOLIDAY, this.ass);
        this.parseResults = chrono.casual.parse(this.clause); // custom parser fires event that sets holiday detail... smelly
        removeEventListener(eHOLIDAY, this.ass);

        this.parsedDate = this.parseResults[0]?.date() ?? new Date();
        // console.log("setClause: %c" + this.parsedDate, 'color:red');
        this.handleHolidays();

        if (this.clause.match(ANY_CLAUSE)) throw new Error("Clause may not have any subclauses: " + this.clause);
        // console.log(this);
    }

    private handleHolidays() {
        this._rruleVersion = this.clause;
        if (this.details.length) { //entering here means the listener was triggered and we have a holiday
            for (let detail of this.details) {
                let hday = detail.holiday;
                if (this.isRecurrent) {
                    this._rruleVersion = (hday.type == 'rel')
                        ? this._rruleVersion.replace(detail.pattern, hday.rrule)
                        : this._rruleVersion.replace(detail.pattern, DU.monthName(hday.month) + ' on ' + DU.nth(hday.date));
                }
                else {
                    // this is jank, but in order to work on e.g. "last halloween" we need to convert to "last year" with a ref date of this halloween
                    if (this.clause.match(/(this|ago|last|next)/)) {
                        // console.log('Here: ', detail.date, this.parsedDate, this.parseResults[0], this.parseResults[0].start.date());
                        this.parseResults = chrono.casual.parse(this.clause.replace(detail.pattern, 'year'), detail.date);
                        this.parsedDate = this.parseResults[0].date();
                        // console.log('Here: ', detail.date, this.parsedDate, this.parseResults[0]);
                        console.log("handleHolidays: %c" + this.parsedDate, 'color:red');
                    }
                }

            }
            this.details = null;
        }
    }
}

export class MetaClause extends Clause {
    included: boolean;
    isRecurrent: boolean;

    every: Clause;
    starting: Clause;
    ending: Clause;

    constructor(type: string, clause: string) {
        super();
        this.included = type === 'include';
        let types = GetClauses(clause, ANY_CLAUSE, E.TYPES);
        let clauses = GetClauses(clause, ANY_CLAUSE, E.CLAUSES);

        if (hasDuplicates(types)) throw new Error("Cannot have multiple clauses of the same type");

        for (let [T, cz] of zip(types, clauses)) {
            let whichT: Clause;
            T = T.toLowerCase();
            if (!(CLAUSES.contains(T))) throw new Error("What the fuck man\n" + T);

            switch (T) {
                case 'every': this.every = new Clause(true); whichT = this.every; break;
                case 'starting': this.starting = new Clause(); whichT = this.starting; break;
                case 'ending': this.ending = new Clause(); whichT = this.ending; break;
            }
            whichT.setClause(cz);
            // if (whichT.parseResults)
        }

        this.isRecurrent = this.every != undefined;
        if (!this.isRecurrent) {
            super.setClause(clause);
            // some things chrono can't handle, like 'march on the 2nd last day'
            if (clause.match(/on/)) // rrule apparantly doesn't error out on 'every this fri' and treats it as 'every day' so this is a bandaid for now
                try {

                    // console.log("HALLO ", this.parsedDate);
                    let count = 0, opt = RRule.parseText(this.rruleVersion);
                    opt.dtstart = this.parsedDate;
                    this.parsedDate = new RRule(opt).all(() => !count++)[0]; // so after chrono does it's part, we treat it like a recurrance and grab the first occurance
                    // console.log("HALLO ", this.parsedDate);
                }
                catch {
                    // for now, we'll just assume that if rrule errors out, then chrono's result was good enough already
                }
        }
        console.log('EXITING', this);
    }

    public setClause(value: string): void { throw new Error("Called MetaClause.setClause"); } // doing this for now to make sure nothing accidentally does holiday preprocessing

}

