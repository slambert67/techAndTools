const api = (() => {
    /*
        Strings are immutable primitives, meaning
            They can’t be modified in place
            Assigning them simply copies the value.

        Strings are iterable
    */


    // prefer primitives to object wrappers

    function stringObject() {
        let s = new String('foo');
        console.log( typeof(s) );       // object
    }

    function stringLiteral() {
        let s = 'bar';
        console.log( typeof(s) );       // string
    }

    function testEquality(s,y) {
        // only works with literals
        console.log( s === y );
    }

    function testLocaleCompare() {
        // localeCompare() compares two strings using language-aware rules, not just ASCII order.
        console.log( "apple".localeCompare("banana") );  // -1

        let result = ["file2", "file10", "file1"].sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );
        console.log(result);
        // ["file1", "file2", "file10"]
    }

    function testModify() {
        let s = 'foo';      // foo created in memory. s points to this
        s = 'bar';          // bar created in memory. s now points to this. foo will be garbage collected
        console.log(s);     // bar

        s[0] = 'f';         // does not work as s is immutable
        console.log(s);     // bar. 

        s = s.concat('foo');    // barfoo created in memory. see first example
        console.log(s);
    }

    function testSplit() {
        // convert string into array
        let s = 'foo';
        let a = s.split(''); 
        console.log(a);         // ['f', 'o', 'o']
        a = a.reverse();        
        console.log(a);         // ['o', 'o', 'f']
        s = a.join('');
        console.log(s);         // oof

    }

    function iterateOverString(s) {
        for (const char of s) {             // for (const i in s)   iterates over indexes
            console.log(char);
        }
        console.log('---');

        for (let i = 0; i < s.length; i++) {
            console.log(s[i]);
        }
    }


    // I18N
    // windows + .
    
    function i18n() {
        const a = 'cafe';
        const b = 'café';
        console.log(`${a} - ${b}`);
        console.log(a === b);
        console.log(a.localeCompare(b, 'en', { sensitivity: 'base' }) === 0); // true
    }


    // possible interview questions

    // palindrome
    function isPalindrome(s) {
        let rs = s.split('').reverse().join('');
        console.log( s === rs );
    }

    // palindrome ignoring case and spaces
    function isPalindrome2(s) {
        let lc = s.toLowerCase();
        let noSpaces = lc.replaceAll(' ', '');
        let reversed = noSpaces.split('').reverse().join('');
        console.log( noSpaces === reversed );
    }

    // count vowels
    function countVowels(s) {
        const vowels = 'aeiou';
        let vowelCount = 0;

        s = s.replaceAll(' ', '').toLowerCase();
        for (const char of s) {
            if ( vowels.includes(char) ) {
                vowelCount++;
            }
        }

        console.log(vowelCount);
    }

    // Capitalize Words
    function capitalize(s) {
        // 'a b c'
        let capitalizedWord;
        let result = [];
        let words = s.split(' ');
        //console.log(words);

        for (const word of words) {
            console.log(word.substring(0,1));
            //console.log( word.substring(1,1) );
            capitalizedWord = word[0].toUpperCase() + word.substring(1, (word.length));
            //console.log(capitalizedWord);
            result.push(capitalizedWord);
        }

        console.log(result.join(' '));
    }
    
    return { stringObject, stringLiteral, testEquality, testLocaleCompare, testModify, iterateOverString, testSplit, isPalindrome, isPalindrome2, countVowels, capitalize, i18n };


})();

//api.stringObject();
//api.stringLiteral();
//api.testEquality('foo', 'foo');
//api.testLocaleCompare();
//api.testModify();
//api.testSplit();
//api.iterateOverString('hello');
//api.isPalindrome('hhh');
//api.isPalindrome2('H H H');
//api.countVowels('a e z');
//api.capitalize('aaa bbb ccc');
api.i18n();