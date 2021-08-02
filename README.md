# Next.js Internet Computer Starter Template

This project provides a simple starter template for Dfinity Internet Computer using Next.js framework as frontend.

**Backend**  
A simple greeting hello world actor function coded in Motoko.

**Frontend**  
A simple React HTML form with name input, sending it to greet actor in backend and showing the returned result.

## Live Demo in IC Mainnet 🥳

https://u4gun-5aaaa-aaaah-qabma-cai.raw.ic0.app

![Screenshot](/public/demo-screenshot.png)

## Quick Start (Run locally)

Install:

-   NodeJS 14.\* or higher https://nodejs.org/en/download/
-   Internet Computer dfx CLI https://sdk.dfinity.org/docs/quickstart/local-quickstart.html
-   Visual Studio Code (Recommended Code Editor) https://code.visualstudio.com/Download
-   VSCode extension - Motoko (Recommended) https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko

```bash
sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

Clone this Git repository:

```bash
git clone https://github.com/dappblock/nextjs-ic-starter
```

Open command terminal:
Enter the commands to start dfx local server in background:

```bash
cd nextjs-ic-starter
dfx start --background
```

Note: If you run it in MacOS, you may be asked allow connections from dfx local server.

Enter the commands to install dependencies, deploy canister and run Next.js dev server:

```bash
npm install
dfx deploy
npm run dev
```

Open in Chrome the following URL to try the demo app:  
http://localhost:3000/

Cleanup - stop dfx server running in background:

```bash
dfx stop
```

## Project Structure

Internet Computer has the concept of [Canister](https://sdk.dfinity.org/docs/developers-guide/concepts/canisters-code.html) which is a computation unit. This project has 2 canisters:

-   hello (backend)
-   hello_assets (frontend)

Canister configuration are stored in dfx.json.

### Backend

Backend code is inside /src/hello/main.mo writting in [Motoko language](https://sdk.dfinity.org/docs/language-guide/motoko.html). Motoko is a type-safe language with modern language features like async/await and actor build-in. It also has [Orthogonal persistence](https://sdk.dfinity.org/docs/language-guide/motoko.html) which I find it very interesting.
Frontend code follows Next.js folder convention with /pages storing all React code, /public storing static files including images. This project uses CSS modules for styling which is stored in /styles.

### Frontend

Frontend code is inside /pages/index.js where the magic happens. With the generated code inside /.dfx, frontend can use RPC style call to server side actor and its functions without worrying about HTTP request and response parsing.

Starting with DFX 0.8.0, we start using the DFX generated front end code locateing in .dfx/local/canisters/hello/index.js
and adapt it to work with Next.js. The adapted code is in ui/declaration/hello/index.js .

We use a service locator pattern through actor-locator.js that will handle the dfx agent host using env var NEXT_PUBLIC_IC_HOST.

Creating hello actor:

```javascript
import { makeHelloActor } from "../ui/service/actor-adapter"
const hello = makeHelloActor()
```

Calling hello actor:

```javascript
const greeting = await hello.greet(name)
```

The beautiful part is you can invoke the hello actor greet function with async/await style as if they are on the same platform.

Webpack configuration:  
In Next.js, it's located in next.config.js.

## Backend dev

After marking changes in backend code e.g main.mo in /src/hello, you can deploy it to the local DFX server using:

```bash
dfx deploy hello
```

**hello** is the backend canister name defined in dfx.json.

## Frontend dev - Next.js Static Code

Next.js developers are familar with the handy hot code deploy in Next.js dev environment when making changes in frontend code.

After deploying your backend code as shown above, you can run Next.js local dev server **npm run dev** and edit your frontend code with all the benefits of hotcode deploy.

One thing to note is we use Next.js static code export here so we can't use any features of Next.js that require server side NodeJS. I think potentially there would be ways to use Internet Computer canister as backend while deploying Next.js dapp to a hosting like Vercel that supports NodeJS server. Further research is needed on that aspect.

## Deploy and run frontend in local DFX server

In order to simulate the whole Internet Computer experience, you can deploy and run frontend code to local DFX server by running:

```bash
dfx start --background
npm run build
dfx deploy hello_assets
```

**hello_assets** is the frontend canister defined in dfx.json.

**npm run build** builds and export Next.js as static code storing in /out folder which would be picked up by **dfx deploy hello_assets** as defined in dfx.json with **out** as the source.

When it completes, you can open Chrome and browse to:  
http://localhost:8000/?canisterId=[canisterId]

Replace [canisterId] with the hello_assets canister ID which you can find by running:

```bash
dfx canister id hello_assets
```

## Environment Configuration

There are three key configs following Next.js [Environment Variables](https://nextjs.org/docs/basic-features/environment-variables) configuration:

**.env.development** stores configs for use in local dev.

```
NEXT_PUBLIC_IC_HOST=http://localhost:8000
```

**.env.production** is used when building and exporting static code using **npm run buld**

```
NEXT_PUBLIC_IC_HOST=http://localhost:8000
```

Notice both files are identical if we want the Next.js dapp to interact with local dfx server.

Note **NEXT_PUBLIC** is the prefix used by Next.js to make env vars available to client side code through [build time inlining](https://nextjs.org/docs/basic-features/environment-variables).

**.env.ic** is included for deployment to Internet Computer ic network which would be covered below.

## Deploy to IC Network Canister

The most exciting part is to deploy your Next.js / Internet Computer Dapp to production Internet Computer IC blockchain network.

To do that you will need:

-   ICP tokens and convert it to [cycles](https://sdk.dfinity.org/docs/developers-guide/concepts/tokens-cycles.html)
-   Cycles wallet

Dfiniy will offer [free cycle](https://dfinity.org/developers/) to developers soon at the time of writting. In the meantime, you can buy ICP from [crypto exchanges](https://coinmarketcap.com/currencies/internet-computer/markets/) like what I did and transfer the ICP tokens to your wallet.

Follow the [Network Deployment](https://sdk.dfinity.org/docs/quickstart/network-quickstart.html) guide to create wallet.

Now, you can deploy your Next.js dapp to Internet Computer IC network by adding **--network ic** to the dfx subcommand. We will first update our env var to point to IC network host. Then deploy backend canister **hello** first, export Next.js static code and deploy frontend canister **hello_assets**.

```bash
cp .env.ic .env.production
dfx deploy --network ic hello
npm run build
dfx deploy --network ic hello_assets
```

Open Chrome and go to https://[canisterId].raw.ic0.app/  
Replace [canisterId] by the hello_assets canister id in IC network. You can find it by running:

```bash
dfx canister --network ic id hello_assets
```

Congratulations !! Well Done !! 👏 🚀 🎉

## Troubleshooting

Use Chrome Dev Tools / Console / Network. Check if the dapp uses the right canister id and hostname.

## Tricks

To start local canister with no [artifical delay](https://sdk.dfinity.org/docs/release-notes/0.7.1-rn.html):

```bash
dfx start --no-artificial-delay --background
```

## Author

Henry Chan, henry@controlaltdevelop.com  
Twitter: @kinwo

## Contributing

Pleaes feel free to raise issue or submit a pull request.

## License

MIT
