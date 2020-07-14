const leftPad = (value, totalWidth, paddingChar) => {
  console.log('aqui')
  var length = totalWidth - value.toString().length + 1
  return Array(length).join(paddingChar || '0') + value
}
module.exports = leftPad
