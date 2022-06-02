import * as fs from 'fs'
import { resolve } from 'path'

const path = resolve('.', 'package.json')
const packageFile = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }))

const { type, ...content } = packageFile
fs.writeFileSync(path, JSON.stringify(content, null, 2), { encoding: 'utf8' })