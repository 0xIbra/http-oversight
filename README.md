# HTTP Oversight
> A node module that groups together useful http functions to perform various actions.

Installation
------------

Via NPM:

    npm install http-oversight --save


Usage
-----
```js
const oversight = require('http-oversight');

// Check if http is redirected to https
let redirected = await oversight.httpToHttps('www.ibragim.fr/profil');
// true | false

let sslData = await oversight.getSSLData('https://www.ibragim.fr/');
// {
//      subjectName: 'ibragim.fr',
//      issuer: 'Certified Authority',
//      validFrom: 1603356069
//      validTo: 1611132069
//      protocol: 'TLSv1.2'
// }

...
```

API
---

### httpOrHttps(url)
**string** [http, https, both]

Checks the http protocols supported.  

Returns `http` if url is accessible only via **http**.  
Returns `https` if url is accessible only via **https**.

Returns `both` if url is accessible via both **http** and **https**.


### httpToHttps(url) 
**boolean**

Checks if port 80 is redirected to 443 or not (http -> https).  


### httpAccess(url)
**boolean**

Checks if a url is accessible on port 80 (http) without redirection to 443 (https).  


### httpsAccess(url)
**boolean**

Checks if a url is accessible on port 443 (https).


### ping(url, accept2XXOnly = false)
**boolean**

Checks for any response for a url.  
if `accept2XXOnly` is set to `true`, returns `false` for any http response that does not respond with http code `2xx`.


### checkHeartbeat(url)
**boolean**

Checks if a url responds or not.  
If there is any kind of response from an http server, returns `true`.


### getSSLData(url)
**object | null**

Fetches SSL data of for a url if there are any, if not, returns `null`.



LICENSE
-------

    MIT License
    
    Copyright (c) 2020 Ibragim Abubakarov
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
