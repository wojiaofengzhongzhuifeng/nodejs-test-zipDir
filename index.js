const fs = require('fs')
const path = require('path')
const archiver = require('archiver');

const testPath = path.join(__dirname, './test')

init(testPath)
async function init(saveDirPathName){
  try{
    // 1. 根据上传文件名称，创建目录A
    await createDir(saveDirPathName)

    // 2. 创建 js 翻译文件
    const writeTaskPromiseList = pushWriteTaskToList(saveDirPathName)
    await Promise.all(writeTaskPromiseList)

    // 3. 将目录A压缩成zip
    const zipFileOutputPathName = path.resolve(__dirname, `./test.zip`)
    await zipDir(saveDirPathName, zipFileOutputPathName)

  } catch (e) {
    console.error('eeeeeee', e)
  }
}




async function createDir(saveDirPathName){
  return new Promise((resolve, reject)=>{
    fs.mkdir(saveDirPathName, (err) => {
      if(err){
        reject(err)
      }
      resolve(saveDirPathName)
    });
  })
}
function pushWriteTaskToList(saveDirPathName){
  let writeFilePromiseList = []
  const saveFilePathName = path.join(saveDirPathName, `lang.txt`)
  let writePromise = writeFile(saveFilePathName)
  writeFilePromiseList.push(writePromise)
  return writeFilePromiseList

}
async function writeFile(saveFilePathName){
  return new Promise((resolve, reject)=>{
    fs.writeFile(saveFilePathName, "test", function (err) {
      console.log('File is created successfully.');
      if(err){reject(err);return}
      resolve(saveFilePathName)
    });
  })
}
function zipDir (source, out){
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve({source, out}));
    archive.finalize();
  });
}
