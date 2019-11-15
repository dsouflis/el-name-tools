let expect = require('chai').expect;
const describe = require("mocha").describe;
let nametools = require('../index');

describe('el-name-tools', function () {
  describe('#phoneticSkeleton', function () {
    let test = (name, skeleton) => {
      it(`should return "${skeleton}" for "${name}"`, function () {
        let res = nametools.phoneticSkeleton(name);
        expect(res).to.equal(skeleton);
      });
    };
    test("Αέρας", "αερασ");
    test("Βαγγέλης", "βαGελισ");
    test("Αλέξανδρος", "αλεξανδροσ");
    test("αλεκσανδρος", "αλεξανδροσ");
    test("αλεξαντρος", "αλεξανδροσ");
    test("ΓΙΩΡΓΟΣ", "γιοργοσ");
    test("Χάιδω", "χαιδο");
  });

  describe('#init', function () {
    it('should initialize correctly', async function () {
      let result = await nametools.init();
      expect(result).to.equal(true);
    });
  });

  describe('methods needing initialization', function () {
    before(async () => {
      await nametools.init();
    });
    describe('#getGender', function () {
      let test = (name, expectedGender) => {
        it(`should recognize "${name}" as ${expectedGender}`,
            async function () {
              let gender = nametools.getGender(name);
              expect(gender).to.equal(expectedGender);
            });
      };
      test("Θέτις", 'FEMALE');
      test("Πάρις", 'MALE');
      test("Μπούλα", 'FEMALE');
      test("Μπούλης", 'MALE');

      it(`should calculate gender of all names as is`, () => {
        let opposite = (gender) => {
          switch (gender) {
            case 'MALE':
              return 'FEMALE';
            case 'FEMALE':
              return 'MALE';
            default:
              return gender;
          }
        };
        let test = (names) => {
          for (var nameDesc of names) {
            for (var name of nameDesc.names) {
              let gender = nametools.getGender(name);
              expect(gender,
                  `Expected ${gender} to equal ${nameDesc.gender} for ${name}`).to.not.equal(
                  opposite(nameDesc.gender));
            }
          }
        };

        test(nametools.maleNames);
        test(nametools.femaleNames);
      });

    });

    describe('#getVocative', function () {
      let test = (inputname, vocative) => {
        it(`should address "${inputname}" as "${vocative}"`, async function () {
          let name = nametools.getVocative(inputname);
          expect(name).to.equal(vocative);
        });
      };
      test("Δημήτρης", "Δημήτρη");
      test("Δημήτριος", "Δημήτριε");
      test("Παναγιώτης", "Παναγιώτη");
      test("Αιμιλιανός", "Αιμιλιανέ");
      test("Δαναός", "Δαναέ");
      test("Δαναός", "Δαναέ");
      test("Κυριάκος", "Κυριάκο");
      test("Χρήστος", "Χρήστο");
      test("Παύλος", "Παύλο");
      test("Κωνσταντίνος", "Κωνσταντίνε");
      test("Νικηφόρος", "Νικηφόρε");
      test("Ριχάρδος", "Ριχάρδε");
      test("Θεόδωρος", "Θεόδωρε");
      test("Αθανάσιος", "Αθανάσιε");
      test("Χριστόφορος", "Χριστόφορε");
      test("Ήφαιστος", "Ήφαιστε");
      test("Άξιος", "Άξιε");
      test("Βαρθολομαίος", "Βαρθολομαίε");
      test("Πανήκος", "Πανήκο");
    });

    describe('#recognizeAndGetVocative', function () {
      let test = (inputname, vocative) => {
        it(`should recognize and address "${inputname}" as "${vocative}"`,
            async function () {
              let name = nametools.recognizeAndGetVocative(inputname);
              expect(name).to.equal(vocative);
            });
      };
      test("Πανήκος", "Πανίκο");
    });

    describe('#recognizeAndGetNormalizedVocative', function () {
      let test = (inputname, vocative) => {
        it(`should formally address "${inputname}" as "${vocative}"`,
            async function () {
              let name = nametools.recognizeAndGetNormalizedVocative(inputname);
              expect(name).to.equal(vocative);
            });
      };
      test("Πανήκος", "Παναγιώτη");
    });

    describe('#recognizeName', function () {
      let test = (inputName, recognized) => {
        it(`should recognize "${inputName}" as "${recognized}"`,
            async function () {
              let name = nametools.recognizeName(inputName);
              expect(name.allnames[0]).to.have.valueOf(recognized);
            });
      };
      test("Παναγιώτης", "Παναγιώτης");
      test("Πάνος", "Παναγιώτης");
      test("παναγιοτης", "Παναγιώτης");
      test("αγκελικι", "Αγγελική");
    });

  });

  describe('needing nameday initialization', function () {
    before(async () => {
      await nametools.init(2020);
    });
    let test = (name, expectedDate) => {
      it(`should calculate nameday for "${name}" as ${expectedDate}`,
          async function () {
            let nameData = nametools.recognizeName(name);
            let namedayDateΜillis = nameData.namedayDates[2020].map(
                d => d.getTime());
            expect(namedayDateΜillis).to.include(expectedDate.getTime());
          });
    };
    test("Δημήτρης", new Date('2020-10-26'));
    test("Παναγιώτης", new Date('2020-08-15'));
    test("Γιώργος", new Date('2020-04-23'));
    test("Αναστάσης", new Date('2020-04-19'));
    test("Γρηγόρης", new Date('2020-11-14'));
    test("Αδάμ", new Date('2020-12-13'));
    test("Χλόη", new Date('2020-02-16'));
    test("Λάζαρος", new Date('2020-04-11'));
  });

});