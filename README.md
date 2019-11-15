# el-name-tools

- [Source Code](https://www.github.com/dsouflis/el-name-tools)
- [Downloads](https://www.npmjs.org/package/el-name-tools)

## Synopsis
El-name-tools is a package assembling a set of tools to work with Greek names.

- It can recognize around 2000 forms of around 1200 male and female given names, present in its name dictionary
- It can do so in the presence of usual misspellings, since matching is done using the phonetic rendering of the names
- It can calculate namedays for specific years (data for 2019 - 2049 are included)
- It can recognize the gender of any Greek name, regardless of its presence in the aforementioned dictionary
- It can form the vocative form of any Greek name, regardless of its presence in the aforementioned dictionary

## Usage
### Including the package
```ecmascript 6
let nametools = require('el-name-tools');
```
### Initializing without calculating namedays
The `#init` function loads the name dictionary and the yeardata
```ecmascript 6
let result = await nametools.init();
if( !result ) {
  console.log('Initialization failed!')
}
```

### Initializing while calculating namedays
The `#init` function with arguments (``start-year``, ``end-year-inclusive``) calculates
namedays for the year range specified. Omitting the second argument defaults to a range of one year. 
```ecmascript 6
let result = await nametools.init(2020,2021);
if( !result ) {
  console.log('Initialization failed!')
}
```

### Phonetic Skeleton
The phonetic skeleton is the phonetic rendering of its argument, which must be a Greek word.
This function does not need any data, so it does not need prior initialization.
```ecmascript 6
let skel = nametools.phoneticSkeleton('αιλουρος');
// Results in 'ελUροσ'
``` 

## Resources

- [MIT License](LICENSE.md)

## Links

- [Blog article](https://dsouflis.wordpress.com/2017/07/13/gender-detection-vocatives-and-namedays-for-greek-first-names-in-tellody/)
