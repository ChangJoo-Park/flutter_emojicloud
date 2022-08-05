const fs = require('fs')
const { exec } = require("child_process");
const cheerio = require('cheerio')
const path = require('path')
const rimraf = require("rimraf")
const SOURCE_ROOT = path.join(__dirname, 'emojicloud', 'svg')
const TARGET_ROOT = path.join(__dirname, 'lib', 'svg')
const PROPERTY_TEMPLATE = `static const String {{property}} = "{{path}}";`

function resetSubmodule() {
    exec('git submodule foreach git reset --hard')
}

function readSvgs(dir) {
    return fs.readdirSync(dir).filter(file => file.endsWith('.svg'))
}

function removeExtension(filePath = '.') {
    return filePath.split('.')[0]
}

function moveDefsFirst(filePath) {
    const absolutePath = path.join(SOURCE_ROOT, filePath)
    const rawSvg = fs.readFileSync(absolutePath).toString()
    const $ = cheerio.load(rawSvg)
    const defs = $('svg defs').clone()
    $('svg defs').remove()
    $('svg').prepend(defs)
    return $('body').html()
}

function makeNewSvgDirectory() {
    const dir = path.join(__dirname, 'lib', 'svg')
    rimraf.sync(dir)
    fs.mkdirSync(dir);
    return dir
}

function moveSvgs(files) {
    files.forEach(file => fs.writeFileSync(path.join(svgDir, file), moveDefsFirst(file)))
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
resetSubmodule()
const files = readSvgs(SOURCE_ROOT)
const svgDir = makeNewSvgDirectory()
moveSvgs(files)

const modified = readSvgs(TARGET_ROOT)

let fullContent = `
class EmojiCloud {
{{content}}
}`;

const content = modified.filter(f => !f.includes('.svg.svg')).map(m => {
    const fileName = removeExtension(m).replace('-', ' ')
    const splitted = fileName.split(' ')
    // make property
    const property = splitted.map((part, index) => {
        let str = part.toLowerCase()
        if (index == 0) {
            return str;
        }
        str = capitalizeFirstLetter(str)
        return str
    }).join('')
    return `${PROPERTY_TEMPLATE}`.replace('{{property}}', property).replace('{{path}}', `lib/svg/${m}`)
}).join('\n  ')


fullContent = fullContent.replace('{{content}}', content)
const targetPath = path.join(__dirname, 'lib', 'emojicloud.dart')
fs.writeFileSync(targetPath, fullContent)
