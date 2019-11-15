const fs = require('fs').promises;

var yearlyData = [];

let readYearlyData = async () => {
  try {
    let data = await fs.readFile('yearlyData.json');
    try {
      const dataJson = JSON.parse(data);
      console.log(
          `Read yearly data from ${dataJson[0].yearnum} to ${dataJson[dataJson.length
          - 1].yearnum}`);
      return dataJson;
    } catch (error) {
      console.log(`Parsing yearly data failed: ${error}`);
    }
  } catch (error) {
    console.log(`Reading yearly data failed: ${error}`);
  }
};

var maleNames = [];
var femaleNames = [];

let readNames = async (gender) => {
  try {
    let data = await fs.readFile(`${gender}Names.json`);
    try {
      const dataJson = JSON.parse(data);
      var n = 0;
      dataJson.forEach(x => {
        let names = x.namestext.split(',');
        n += names.length;
        x.names = names;
        x.skeletons = names.map(n => phoneticSkeleton(n));
      });
      console.log(
          `Read ${dataJson.length} ${gender} names with ${n} total forms`);
      return dataJson;
    } catch (error) {
      console.log(`Parsing ${gender} names failed: ${error}`);
    }
  } catch (error) {
    console.log(`Reading ${gender} names failed: ${error}`);
  }
};

let vowelsWT = ['α', 'ε', 'η', 'ι', 'υ', 'ο', 'ω'];
let vowelsT = ['ά', 'έ', 'ή', 'ί', 'ύ', 'ό', 'ώ', 'ϊ', 'ΐ'];

let isVowel = (c) => vowelsT.includes(c) || vowelsWT.includes(c);

let maleIs = ["Άγις", "Άδωνις", "Αναξίπολις", "Βάκις", "Βόρις", "Θέογνις",
  "Θέσπις", "Πάρις", "Ναθαναήλ"];
let maleIsNormalized = maleIs.map(s => s.toLocaleLowerCase().split('').map(
    c => c.normalize("NFD").charAt(0)).join(''));

let phoneticSkeleton = (name) => phoneticSkeletonAux(
    name.toLocaleLowerCase().split(''), []);

let phoneticSkeletonAux = (s, accum) => {
  // console.log(`s=${s}, accum=${[...accum].reverse().join('')}`);
  if (!s || !s.length) {
    return accum.reverse().join('');
  } else {
    let [first, ...rest] = s;
    switch (first) {
      case 'ά': {
        if (rest[0] === 'ι') {
          return phoneticSkeletonAux(rest.slice(1),
              ['ι', 'α', ...accum]);
        } else {
          return phoneticSkeletonAux(['α', ...rest], accum);
        }
      }

      case 'α': {
        let [first1, ...rest1] = rest;
        switch (first1) {
          case 'ι':
            return phoneticSkeletonAux(rest1, ['ε', ...accum]);
          case 'ϊ':
            return phoneticSkeletonAux(rest1, ['ι', 'α', ...accum]);
          case 'ΐ':
            return phoneticSkeletonAux(rest1, ['ι', 'α', ...accum]);
          case 'υ':
          case 'ύ':
            if (!rest1 || isVowel(rest1[0])) {
              return phoneticSkeletonAux(rest1,
                  ['β', 'α', ...accum]);
            } else {
              return phoneticSkeletonAux(rest1, ['φ', 'α', ...accum]);
            }
          default:
            return phoneticSkeletonAux(rest, ['α', ...accum]);
        }
      }
      case 'ε': {
        let [first1, ...rest1] = rest;
        switch (first1) {
          case 'ι':
            return phoneticSkeletonAux(rest1, ['ι', ...accum]);
          case 'ϊ':
            return phoneticSkeletonAux(rest1, ['ι', 'ε', ...accum]);
          case 'ΐ':
            return phoneticSkeletonAux(rest1, ['ι', 'ε', ...accum]);
          case 'υ':
          case 'ύ':
            if (!rest1 || isVowel(rest1[0])) {
              return phoneticSkeletonAux(rest1,
                  ['β', 'ε', ...accum]);
            } else {
              return phoneticSkeletonAux(rest1, ['φ', 'ε', ...accum]);
            }
          default:
            return phoneticSkeletonAux(rest, ['ε', ...accum]);
        }
      }
      case 'ο': {
        let [first1, ...rest1] = rest;
        switch (first1) {
          case 'ι':
            return phoneticSkeletonAux(rest1, ['ι', ...accum]);
          case 'υ':
            return phoneticSkeletonAux(rest1, ['U', ...accum]);
          default:
            return phoneticSkeletonAuxDefault(first, rest, accum);
        }
      }

      case 'γ': {
        let [first1, ...rest1] = rest;
        switch (first1) {
          case 'κ':
          case 'γ':
            return phoneticSkeletonAux(rest1, ['G', ...accum]);
          default:
            return phoneticSkeletonAuxDefault(first, rest, accum);
        }
      }

      case 'κ': {
        if (rest[0] === 'σ') {
          return phoneticSkeletonAux(rest.slice(1),
              ['ξ', ...accum]);
        } else {
          return phoneticSkeletonAuxDefault(first, rest, accum);
        }
      }

      case 'ν': {
        let [c1, c2, ...rest1] = rest;
        if (c1 === 'τ' && c2 === 'ρ') {
          return phoneticSkeletonAux(
              ['ν', 'δ', 'ρ', ...rest1], accum);
        } else {
          return phoneticSkeletonAuxDefault(first, rest, accum);
        }
      }

      case 'η':
        return phoneticSkeletonAux(rest, ['ι', ...accum]);
      case 'υ':
        if (rest[0] === 'φ') {
          return phoneticSkeletonAux(rest.slice(1),
              ['φ', ...accum]);
        } else {
          return phoneticSkeletonAux(rest, ['ι', ...accum]);
        }
      case 'ω':
        return phoneticSkeletonAux(rest, ['ο', ...accum]);
      case 'ς':
        return phoneticSkeletonAux(rest, ['σ', ...accum]);
      default:
        return phoneticSkeletonAuxDefault(first, rest, accum);
    }
  }
};

let phoneticSkeletonAuxDefault = (first, rest, accum) => {
  if (first === rest[0] && !isVowel(first)) {
    return phoneticSkeletonAux([first, ...rest.slice(1)], accum);
  } else {
    let c = first.normalize("NFD").charAt(0);
    if (c === first) {
      return phoneticSkeletonAux(rest, [c, ...accum]);
    } else {
      return phoneticSkeletonAux([c, ...rest], accum);
    }
  }

};

let recognizeName = (name) => {
  let skel = phoneticSkeleton(name);

  function findName(names) {
    let maleName = names.find(nd => nd.skeletons.includes(skel));
    if (maleName) {
      let i = maleName.skeletons.findIndex(s => s === skel);
      return {
        name: maleName.names[i],
        skeleton: skel,
        allnames: maleName.names,
        namedays: maleName.namedays,
        namedayDates: maleName.namedayDates,
        gender: maleName.gender
      };
    }
  }

  return findName(maleNames) || findName(femaleNames);
};

let getGender = (name) => {
  name = name.toLocaleLowerCase()
  let suffix2 = (name.length > 2) ? name.substring(name.length - 2) : name;
  let suffix3 = (name.length > 3) ? name.substring(name.length - 3) : name;
  if (name === ("ραχήλ") || name === ("ραχηλ") ||
      name === ("ολυμπιάς") || name === ("ολυμπιας") ||
      name === ("ναϊάς") || name === ("ναϊας") ||
      name === ("ναιάς") || name === ("ναιας") ||
      name === ("ηρωδιάς") || name === ("ηρωδιας") ||
      name === ("ορεστιάς") || name === ("ορεστιας") ||
      name === "εύχαρης" || name === "ευχαρης"
  ) {
    return 'FEMALE';
  } else if (suffix2 === ("ος") ||
      suffix2 === ("ός") ||
      suffix2 === ("ης") ||
      suffix2 === ("ής") ||
      suffix2 === ("ας") ||
      suffix2 === ("άς") ||
      suffix2 === ("ίδ") ||
      suffix2 === ("ιδ") ||
      suffix2 === ("ήλ") ||
      suffix2 === ("ηλ") ||
      suffix2 === ("ήφ") ||
      suffix2 === ("ηφ") ||
      suffix3 === ("ειμ") ||
      suffix3 === ("είμ") ||
      suffix2 === ("ων") ||
      suffix2 === ("ών") ||
      suffix3 === ("εύς") ||
      suffix3 === ("ευς") ||
      suffix2 === ("ωρ") ||
      suffix2 === ("ώρ") ||
      suffix2 === ("αμ") ||
      suffix2 === ("άμ") ||
      suffix2 === ("ωφ") ||
      suffix2 === ("ώφ") ||
      suffix2 === ("ως") ||
      suffix2 === ("ώς") ||
      suffix2 === ("ιν") ||
      suffix2 === ("ίν") ||
      suffix3 === ("αιμ") ||
      suffix3 === ("αίμ") ||
      suffix2 === ("ώβ") ||
      suffix2 === ("ωβ") ||
      suffix3 === ("ουμ") ||
      suffix3 === ("ούμ") ||
      suffix3 === ("ους") ||
      suffix3 === ("ούς") ||
      suffix2 === ("ακ") ||
      suffix2 === ("άκ") ||
      suffix2 === ("ωτ") ||
      suffix2 === ("ώτ") ||
      suffix2 === ("οτ") ||
      suffix2 === ("ότ")) {
    return 'MALE';
  } else if (suffix2 === ("ις") ||
      suffix2 === ("ίς") ||
      suffix2 === ("ΐς") ||
      suffix2 === ("ϊς")) {
    let string1 = name.split('').map(c => c.normalize("NFD").charAt(0)).join(
        '');
    if (maleIsNormalized.includes(string1)) {
      return 'MALE';
    } else {
      return 'FEMALE';
    }
  } else {
    let suffix1 = (name.length > 1) ? name.substring(name.length - 1) : name;
    if (suffix1 === ("ω") ||
        suffix1 === ("ώ") ||
        suffix1 === ("η") ||
        suffix1 === ("ή") ||
        suffix1 === ("α") ||
        suffix1 === ("ά") ||
        suffix2 === ("ου") ||
        suffix2 === ("ού") ||
        suffix2 === ("ετ") ||
        suffix2 === ("έτ") ||
        suffix3 === ("ιάς") ||
        suffix3 === ("ιας") ||
        suffix2 === ("δα") ||
        suffix2 === ("ηρ") ||
        suffix2 === ("ήρ")) {
      return 'FEMALE';
    } else {
      return 'NONE';
    }
  }
};

let getVocative = (name) => {
  let suffix2 = (name.length > 2) ? name.substring(name.length - 2) : name;
  let suffix3 = (name.length > 3) ? name.substring(name.length - 3) : name;
  let suffix4 = (name.length > 4) ? name.substring(name.length - 4) : name;
  let suffix5 = (name.length > 5) ? name.substring(name.length - 5) : name;
  if (getGender(name) === 'MALE' &&
      (suffix2 === ("ης") ||
          suffix2 === ("ής") ||
          suffix2 === ("ας") ||
          suffix2 === ("άς") ||
          suffix2 === ("ις") ||
          suffix2 === ("ίς"))) {
    return name.substring(0, name.length - 1);
  } else if (getGender(name) === 'MALE' && (suffix5 === ("τίνος") ||
      suffix5 === ("τινος")) ||
      suffix4 === ("αίος") ||
      suffix4 === ("αιος") ||
      suffix5 === ("φόρος") ||
      suffix5 === ("φορος") ||
      suffix5 === ("άρδος")) {
    let local = name.substring(0, name.length - 2);
    return local + "ε";
  } else if (getGender(name) === 'FEMALE' && suffix2 === ("ις")) {
    return name.substring(0, name.length - 1);
  } else if (getGender(name) === 'MALE' && (suffix2 === ("ως") ||
      suffix3 === ("εύς") ||
      suffix3 === ("ευς") ||
      suffix3 === ("ούς") ||
      suffix3 === ("ους"))) {
    return name.substring(0, name.length - 1);
  } else if (getGender(name) === 'MALE' && suffix2 === ("ωρ")) {
    let local = name.substring(0, name.length - 2)
    return local.concat("ορ");
  } else if (getGender(name) === 'MALE' && suffix2 === ("ός")) {
    let local = name.substring(0, name.length - 2)
    return local + "έ";
  } else if (getGender(name) === 'MALE' && suffix2 === ("ος")) {
    let local = name.substring(0, name.length - 2)
    return local + getEnding(name);
  } else {
    return name;
  }
};

let isParoxytono = (name) => {
  let aux = (countL, vowels) => {
    if (countL >= name.length) {
      return false;
    } else {
      let letter = name[name.length - countL - 1].toLocaleLowerCase();
      if (vowelsT.includes(letter)) {
        return vowels === 1;
      } else if (vowelsWT.includes(letter)) {
        return aux(countL + 1, vowels + 1);
      } else {
        return aux(countL + 1, vowels);
      }
    }
  };
  return aux(2, 1);
};

let getEnding = (name) => {
  let paroxytono = isParoxytono(name);
  if (paroxytono) {
    return "ο";
  } else {
    return "ε";
  }
};

let recognizeAndGetGender = (name) => {
  let nameData = recognizeName(name);
  if (nameData) {
    return nameData.gender;
  } else {
    return getGender(name);
  }
};
let recognizeAndGetVocative = (name) => {
  let nameData = recognizeName(name);
  if (nameData) {
    return getVocative(nameData.name);
  } else {
    return getVocative(name);
  }
};

let recognizeAndGetNormalizedVocative = (name) => {
  let nameData = recognizeName(name);
  if (nameData) {
    return getVocative(nameData.allnames[0]);
  } else {
    return getVocative(name);
  }
};

let calculateNameday = (nameDaySpec, year) => {
  switch (nameDaySpec.case) {
    case 'no-nameday':
      return null;
    case 'fixed':
      return new Date(`${year}` + nameDaySpec.date.substring(4));
    case 'sunday-after-dec11':
      return new Date(yearlyData.find(d => d.yearnum === year).sunday1);
    case 'sunday-after-feb13':
      return new Date(yearlyData.find(d => d.yearnum === year).sunday2);
    case 'easterincr': {
      let yearData = yearlyData.find(d => d.yearnum === year);
      let date = new Date(yearData.easterdt);
      date.setDate(date.getDate() + nameDaySpec.incr);
      return date;
    }
    case 'easter-alt': {
      let yearData = yearlyData.find(d => d.yearnum === year);
      let date = new Date(yearData.easterdt);
      let easterTest = new Date(
          `${year}` + nameDaySpec.easteraltdt.substring(4));
      if (date.getTime() < easterTest.getTime()) {
        return easterTest;
      } else {
        easterTest.setDate(easterTest.getDate() + nameDaySpec.easteraltincr);
        return easterTest;
      }
    }
    default: return null;
  }
};

let calculateNamedays = (nameData, startYear, endYear) => {
  nameData.namedayDates = {};
  for (var yr = startYear; yr <= endYear; yr++) {
    let dateArray = [];
    nameData.namedayDates[yr] = dateArray;
    for (var nameDaySpec of nameData.namedays) {
      dateArray.push(calculateNameday(nameDaySpec, yr));
    }
  }
};

const it = {
  init: async (startYear, endYear) => {
    try {
      let result = await Promise.all(
          [readNames('male'), readNames('female'), readYearlyData()]);
      maleNames.push.apply(maleNames, result[0]);
      femaleNames.push.apply(femaleNames, result[1]);
      yearlyData.push.apply(yearlyData, result[2]);
      if (startYear) {
        if (!endYear) {
          endYear = startYear;
        } else {
          endYear = Math.max(startYear, endYear);
        }
        for (var nameData of maleNames) {
          calculateNamedays(nameData, startYear, endYear);
        }
        for (var nameData of femaleNames) {
          calculateNamedays(nameData, startYear, endYear);
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  },
  phoneticSkeleton,
  recognizeName,
  getGender,
  recognizeAndGetGender,
  getVocative,
  recognizeAndGetVocative,
  recognizeAndGetNormalizedVocative,
  maleNames,
  femaleNames
};

module.exports = it;
