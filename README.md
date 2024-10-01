<div align="center">

# Truth Table

![license-info](https://img.shields.io/github/license/Ashu11-A/truth-table-wasm?style=for-the-badge&colorA=302D41&colorB=f9e2af&logoColor=f9e2af)
![stars-infoa](https://img.shields.io/github/stars/Ashu11-A/truth-table-wasm?colorA=302D41&colorB=f9e2af&style=for-the-badge)
![Last-Comitt](https://img.shields.io/github/last-commit/Ashu11-A/truth-table-wasm?style=for-the-badge&colorA=302D41&colorB=b4befe)

![Comitts Year](https://img.shields.io/github/commit-activity/y/Ashu11-A/truth-table-wasm?style=for-the-badge&colorA=302D41&colorB=f9e2af&logoColor=f9e2af&authorFilter=Ashu11-A&label=COMMIT+ACTIVITY)
![reposize-info](https://img.shields.io/github/languages/code-size/Ashu11-A/truth-table-wasm?style=for-the-badge&colorA=302D41&colorB=90dceb)

</div>

## 🔍 | Why did I do that?

I thought -_-, I really thought that if the language was “compiled” it would be faster, but in this case, believe me, or test it for yourself, this here, I don't think it's even 1% faster than this [same library made in TypeScript](https://github.com/Ashu11-A/truth-table), I researched it further, and really, it's my mistake, believe me, AssemblyScript is more advisable to use in highly heavy libraries that do ridiculous and large calculations, but even so, it was a good learning experience, have a great day!

### 👨‍💻 | Usage:
Here's an example of how to work with this library:
```ts
// ESM:
import {
  convertAstToJson,
  convertTokensToJson,
  createAnalyzer,
  createTokanizer,
  getAnalyzerExceptions,
  getAST,
  getTokanizerExceptions,
  getTokens
} from 'build/release.js'
// Communjs:
// const { convertAstToJson, convertTokensToJson, createAnalyzer, createTokanizer, getAnalyzerExceptions, getAST, getTokanizerExceptions, getTokens } = require('build/release.js')

const tokanizer = createTokanizer('p ^ (p v ~q)')
const tokens = getTokens(tokanizer)

const tokanizerErrors = JSON.parse(getTokanizerExceptions(tokanizer))
if (tokanizerErrors.length > 0) throw console.log(tokanizerErrors)

const analyzer = createAnalyzer(tokens)
const ast = getAST(analyzer)

const astErrors = JSON.parse(getAnalyzerExceptions(analyzer))
if (astErrors.length > 0) throw console.log(astErrors)

const structure = createStructure(ast)
const tableData = getStructure(structure)

console.log(JSON.parse(convertTokensToJson(tokens)))
console.log(JSON.parse(convertAstToJson(ast)))
console.log(JSON.parse(convertStructureToJson(tableData)))
```

## ✨ | Outputs

#### 📜 | AST:
The AST (Abstract Syntax Tree) generated from the input of p ^ (p v ~q):
```json
[
  {
    "value": "p",
    "type": 0, // Proposition
    "negatived": false,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 0
      }
    }
  },
  {
    "type": 1, // Operation
    "value": "^",
    "key": 1, // Conjunction
    "loc": {...}
  },
  {
    "type": 2, // SubExpression
    "body": [
      {
        "value": "p",
        "type": 0, // Proposition
        "negatived": false,
        "loc": {...}
      },
      {
        "type": 1, // Operation
        "value": "v",
        "key": 2, // Disjunction
        "loc": {...}
      },
      {
        "value": "q",
        "type": 0, // Proposition
        "negatived": true,
        "loc": {...}
      }
    ],
    "negatived": false,
    "loc": {...}
  }
]
```

#### 📃 | Structure:
The structured data generated from the AST to generate the truth table:
```json
[
  {
    "element": "p",
    "value": true,
    "type": 0, // Variable
    "position:" "0x0",
    "column": 0,
    "row": 0,
  }, {
    "element": "q",
    "value": true,
    "type": 0, // Variable
    "position:" "0x1",
    "column": 1,
    "row": 0,
  }, {
    "element": "~q",
    "value": false,
    "type": 1, // VariableNegative
    "position:" "0x2",
    "column": 2,
    "row": 0,
  }, {
    "element": "(p v ~q)",
    "value": true,
    "type": 2, // Result
    "position:" "0x3",
    "column": 3,
    "row": 0,
  }, {
    "element": "p ^ (p v ~q)",
    "value": true,
    "type": 2, // Result
    "position:" "0x4",
    "column": 4,
    "row": 0,
  }
  {...}
]
```

## 🤝 | Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

## 📝 | License
Distributed under the MIT License. See LICENSE.txt for more information.
