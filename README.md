# node-videobuster

Simple NodeJS module for fetching your active and upcoming wanted-list from German video-rental service Videobuster. *This module is still under development and not meant to be used in productive environments*.

## Usage

[Installation](https://www.npmjs.com/package/node-videobuster)

```bash
npm i node-videobuster
```

Fetch wanted items:

```javascript
var Videobuster= require('../videobuster.js');

var videobuster= new Videobuster({
  username: '{your username goes here}'
  , password: '{your password goes here}'
});

videobuster.login(function(err, res) {
  console.log(err, res);
  videobuster.getActive(function(err, res) {
    console.log(err, res);
    videobuster.getUpcoming(function(err, res) {
      console.log(err, res);
    });
  });
});
```

will return a list like:

```javascript
  [ { status: 'active',
    title: 'Lucy',
    link: '/dvd-bluray-verleih/193221/lucy#bluray' },
  { status: 'upcoming',
    title: 'Plastic',
    link: '/dvd-bluray-verleih/198831/plastic#bluray' },
  { status: 'upcoming',
    title: 'Nightcrawler',
    link: '/dvd-bluray-verleih/189212/nightcrawler#bluray' } ]
```

`active` means the item is on the executed list.  `upcoming` means, the
video/medium is not yet released and will be executed as soon as it's released.

## TODO

* Encoding still broken.  German Umlaute are not correctly displayed.
* Implement a method to fetch Vide-Details.
* …
 
## Donation

If you like this tool, find it useful or if you just find it useful, that people out there writing free software for everybody to use or contribute, please donate some coins:

Bitcoins `1MzFr1eKzLEC1tuoZ7URMB7WWBMgHKimKe`   
Litecoins `LSRfZJf75MtwzrbAUfQgqzdK4hHpY4oMW3`

## License

### The MIT License (MIT)

Copyright (c) 2013-2014 Alexander Zschach alex@zschach.net

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## FAQ about versioning

Q: Why does this package provide a version 1.x even if it's still Beta?

A: There is no such thing as a zero-version.  Even if it's Beta, even if it's under heavy developmentment,
it is the first version of this package.  That's why I start counting at 1, not at 0.

---

:wq!
