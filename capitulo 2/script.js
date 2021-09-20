const fs = require('fs');
const path = require('path');
const glob = require('glob');

const outFileName = 'arquivo_fonte_remontado.json';

const outFilePath = path.join(__dirname, 'arquivo_fonte_inteiro', outFileName)

const outFileContent = require(outFilePath);
const bigList = outFileContent.Strings


try {

  glob( path.join(__dirname, 'arquivo_fonte_dividido', '*.json'), function err(err, filePaths) {
    if (err) {
      throw err;
    }

    filePaths.forEach(filePath => {
      const fileName = /[^\/\\]+$/.exec(filePath)
      console.log(`Processando arquivo "${fileName}"`)
      
      const sentencesList = require(filePath)

      sentencesList.forEach((currentSentence, idx) => {
        if (idx % 2 === 0) {

          const indexInListOutFile = bigList.findIndex(value => value === currentSentence)

          if (indexInListOutFile === -1) {
            throw `Não encontrou o ID ${currentSentence} dentro de ${outFileName}`
          } else {
            bigList[indexInListOutFile + 1] = sentencesList[idx + 1]
          }
        }
      })
    })

    fs.writeFile(outFilePath, JSON.stringify({"Strings": bigList}), err => {
      console.log(err || `${outFileName} atualizado!`)
    })
  })
}
catch (err) {
  console.error(err);
}