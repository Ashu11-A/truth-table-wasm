// Importa a função principal do seu módulo
import { convertAstToJson, convertTokensToJson, createAnalyzer, createTokanizer, getAnalyzerExceptions, getAST, getTokanizerExceptions, getTokens } from '../build/debug.js'

// // Função para medir o tempo e uso de memória
// function runTests() {
//   const startMemory = process.memoryUsage().heapUsed // Memória antes do teste
//   const startTime = performance.now() // Tempo antes do teste

//   const iterations = 100000000 // Número de iterações

//   // Executa a função principal várias vezes
//   for (let i = 0; i < iterations; i++) {
//     main('c ^ p') // Chama a função com a expressão desejada
//   }

//   const endTime = performance.now() // Tempo após o teste
//   const endMemory = process.memoryUsage().heapUsed // Memória após o teste

//   // Calcula o tempo de execução e o uso de memória
//   const memoryUsed = endMemory - startMemory
//   const timeTaken = endTime - startTime

//   console.log(`Memória utilizada: ${(memoryUsed / 1024).toFixed(2)} KB`)
//   console.log(`Tempo de processamento: ${timeTaken.toFixed(2)} ms`)
// }

// // Executa os testes
// runTests()


const tokanizer = createTokanizer('c ^ t')
const tokens = getTokens(tokanizer)
const tokanizerErrors = JSON.parse(getTokanizerExceptions(tokanizer))

if (tokanizerErrors.length > 0) throw console.log(tokanizerErrors)

const analyzer = createAnalyzer(tokens)
const ast = getAST(analyzer)
const astErrors = JSON.parse(getAnalyzerExceptions(analyzer))

if (astErrors.length > 0) throw console.log(astErrors)

console.log(JSON.parse(convertTokensToJson(tokens)))
console.log(JSON.parse(convertAstToJson(ast)))