# 🚀 Quick Start

📄 Clone or fork `piggy-bank`:

```sh
git clone https://github.com/menezesphill/piggy-bank.git
```

💿 Install all dependencies:

```sh
cd piggy-bank
yarn install
```

🚴‍♂️ Run your App:

```sh
yarn run serve
```

A static server will start and be served at http://localhost:9011


# 🧰 Editing the JS components

In order to modify this dApp, we use [Browserify](https://browserify.org/) to require('modules') on our browser.

💿 Installing Browserify:

```sh
npm install -g browserify
```

Any time we edit [Contract.js](https://github.com/menezesphill/piggy-bank/blob/main/contract.js), it is necessary to bundle all our new edited file with all our dependencies by using:

```sh
browserify contract.js -o bundle.js
```

And reload the dApp by using `Ctrl` + `Shift` + `R` to reload the page and see the changes reflect at http://localhost:9011
