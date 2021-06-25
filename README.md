<p>
<h2 align="center">Next.js Internet Computer Starter Template</h2>
</p>


## Introduction
This project provides a simple starter template for Dfinity Internet Computer using Next.js framework as frontend.

It has custom webpack config in next.config.js for accessing generated dfx Motoko actor in backend.

**Backend**  
A simple greeting hello world actor function coded in Motoko under src/hello/main.mo

**Frontend**
A simple React HTML form with input string, sending it to greet actor in backend and showing the returned result.

## Live Demo in IC Mainnet 🥳 
https://u4gun-5aaaa-aaaah-qabma-cai.raw.ic0.app

![Screenshot](/public/demo-screenshot.png)

## Quick Start (Run locally)
Install:

* NodeJS 14.* or higher https://nodejs.org/en/download/ 
* Internet Computer dfx CLI https://sdk.dfinity.org/docs/quickstart/local-quickstart.html

```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

Clone this Git repository:  
```bash
git clone https://github.com/dappblock/nextjs-ic-starter
```

Open 2 command terminals

Terminal 1:
Enter the commands to start dfx local server:  
```bash
cd nextjs-ic-starter
dfx start
```

Terminal 2:  
Enter the commands to install dependencies, deploy canister and run Next.js dev server:  
```bash
cd nextjs-ic-starter
npm install
dfx deploy
npm run dev
```

Open in Chrome the following URL to try the demo app:  
http://localhost:3000/

## Project Structure
Internet Computer has the concept of [Canister](https://sdk.dfinity.org/docs/developers-guide/concepts/canisters-code.html) which is a computation unit. This project has 2 canisters:

* hello (backend)
* hello_assets (frontend)

Canister configuration are stored in dfx.json.

### Backend  
Backend code is inside /src/hello/main.mo writting in [Motoko language](https://sdk.dfinity.org/docs/language-guide/motoko.html). Motoko is type-safe language with modern language features like async/await and actor build-in. It also has [Orthogonal persistence](https://sdk.dfinity.org/docs/language-guide/motoko.html) which I find it very interesting.
Frontend code follows Next.js folder convention with /pages storing all React code, /public storing static files including images. This project uses CSS modules for styling which is stored in /styles.

### Frontend
Frontend code is inside /pages/index.js where the magic happens. With the generated code inside /.dfx, frontend can use RPC style call to server side actor and its functions without worrying about HTTP request and response parsing.


Initializing hello actor:
```javascript
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as hello_idl, canisterId as hello_id } from 'dfx-generated/hello';

const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST });
const hello = Actor.createActor(hello_idl, { agent, canisterId: hello_id });
```

Calling hello actor:
```javascript
const greeting = await hello.greet(name);
```

The beautiful part is you can invoke the hello actor greet function with async/await style as if they are on the same platform.

Webpack configuration:
In the code above, **'dfx-generated/hello'** is alias created dynamically through Webpack custom configuration. It will make reference to /.dfx/local/canisters/hello/hello.js or /.dfx/ic/canisters/hello/hello.js depending if you deploy to local DFX server or remote Internet Computer IC network. In Next.js, it's located in next.config.js. That is why before you run Next.js server with **npm run dev**, **dfx deploy** command must be run first in order to generate the required JavaScript code in /.dfx.

## Local dev with hot code deploy  
Most of the Next.js developers are familar with the hot code deploy in Next.js dev environment.



## Environment Configuration

## Using IC as frontend & backend
TODO

## Using IC as backend
TODO

## Deploy to IC Network Canister
TODO

## Author
Henry Chan, henry@controlaltdevelop.com  
Twitter: @kinwo

## Contributing
Pleaes feel free to raise issue or submit a pull request.

## License
MIT


