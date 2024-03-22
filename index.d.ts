declare module 'el-name-tools';

export type Gender = 'MALE' | 'FEMALE';

export interface NamedaySpec {
    case: 'no-nameday'|'fixed'|'sunday-after-dec11'|'easterincr'|'easter-alt'|'sunday-after-feb13';
    date?: string;
    incr?: number;
    easteraltdt?: string;
    easteraltincr?: number;
}

export interface NameBase {
    skeletons?: string[];
    gender: Gender;
    namedays: NamedaySpec[];
}

export interface NameSpec extends NameBase {
    namestext: string;
    names: string[];
}

export interface Name extends NameBase {
    name: string;
    allnames: string[]
}

export interface YearlyData {
    yearnum: number;
    easterdt: string;
    sunday1: string;
    sunday2: string;
}

interface NameTools {
    phoneticSkeleton: (s:string) => string;
    recognizeName: (s:string) => Name;
    getGender: (s:string) => Gender;
    recognizeAndGetGender: (s:string) => Gender;
    recognizeAndGetVocative: (name:string) => string;
    recognizeAndGetNormalizedVocative: (name:string) => string;
    getVocative: (name:string) => string;
    calculateNamedays: (nameSpec:NameSpec, startYear: number, endYear: number) => {[year:number]: Date[]};
    maleNames: NameSpec[];
    femaleNames: NameSpec[];
}

export const nametools: NameTools;

