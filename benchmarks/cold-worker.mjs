// One invocation is one fresh process. No library calls occur before timing.
const entryUptimeNs = Math.round(process.uptime() * 1e9)
const [entry, countText, valuesText] = process.argv.slice(2)
const count = Number(countText)
const values = JSON.parse(valuesText)
const clock = () => process.hrtime.bigint()
let importNs = 0
let firstCallNs = 0
let conversionNs = 0
const outputs = []
const operationStart = clock()
if (entry !== 'none') {
  const importStart = clock()
  const api = await import(entry)
  importNs = Number(clock() - importStart)
  if (count > 0) {
    const read = api.readVnNumber
    const start = clock()
    const first = read(values[0])
    firstCallNs = Number(clock() - start)
    outputs.push(first)
    for (let index = 1; index < count; index++) {
      outputs.push(read(values[index % values.length]))
    }
    conversionNs = Number(clock() - start)
  }
}
const completeOperationNs = Number(clock() - operationStart)
// Consume and return complete outputs after timing; the parent verifies them.
console.log(
  JSON.stringify({
    node: process.version,
    v8: process.versions.v8,
    entryUptimeNs,
    importNs,
    firstCallNs,
    conversionNs,
    completeOperationNs,
    outputs,
  }),
)
