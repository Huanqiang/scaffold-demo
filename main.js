#!/usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')
const chalk = require('chalk')
const symbols = require('log-symbols')

// 通过执行命令 yarn --version 的方式，来判断本机是否已经安装了 yarn
// 如果安装了，后续就使用yarn，否则就使用 npm；
function canUseYarn() {
  try {
    spawn('yarnpkg', ['--version'])
    return true
  } catch (error) {
    return false
  }
}

function tryYarn(root) {
  return new Promise((resolve, reject) => {
    let child
    const isUseYarn = canUseYarn()
    if (isUseYarn) {
      // 这里就相当于命令行中执行 `yarn`
      child = spawn('yarnpkg', ['--cwd', root], { stdio: 'inherit' })
    } else {
      // 这里就相当于命令行中执行 `npm install`
      child = spawn('npm', ['install'], { cwd: root, stdio: 'inherit' })
    }
    // 当命令执行完成的时候，判断是否执行成功，并输出相应的输出。
    child.on('close', code => {
      if (code !== 0) {
        reject(console.log(symbols.error, chalk.red(isUseYarn ? 'yarn' : 'npm' + ' 依赖安装失败...')))
        return
      }
      resolve(console.log(symbols.success, chalk.green(isUseYarn ? 'yarn' : 'npm' + ' 依赖安装完成!')))
    })
  })
}

function tryInitGit(root) {
  // 原本模板中，我们就存放了 gitignore 模板文件，需要将其内容复制到新建的 .gitignore 文件中
  try {
    // 如果项目中存在了 .gitignore 文件，那么这个 API 会执行失败，跳入 catch 分支进行合并操作
    fs.moveSync(path.join(root, 'gitignore'), path.join(root, '.gitignore'))
  } catch (error) {
    const content = fs.readFileSync(path.join(root, 'gitignore'))
    fs.appendFileSync(path.join(root, '.gitignore'), content)
  } finally {
    // 移除 gitignore 模板文件
    fs.removeSync(path.join(root, 'gitignore'))
  }

  try {
    spawn('git', ['init'], { cwd: root })
    spawn('git', ['add .'], { cwd: root })
    spawn('git', ['commit', '-m', 'Initial commit from New App'], { cwd: root })
    console.log(symbols.success, chalk.green('Git 初始化完成!'))
  } catch (error) {
    console.log(symbols.error, chalk.red('Git 初始化失败...'))
  }
}

program
  .command('init <name>')
  .description('初始化组件模板')
  .action(async name => {
    // 判断用户是否输入应用名称，如果没有设置为 myApp
    const projectName = name || 'myApp'
    // 获取 template 文件夹路径
    const sourceProjectPath = __dirname + '/template'
    // 获取命令所在文件夹路径
    // path.resolve(name) == process.cwd() + '/' + name
    const targetProjectPath = path.resolve(projectName)

    // 判断文件夹是否存在及其后续逻辑
    if (fs.existsSync(targetProjectPath)) {
      console.log(symbols.info, chalk.blue(`文件夹 ${projectName} 已经存在！`))
      try {
        const { isCover } = await inquirer.prompt([
          { name: 'isCover', message: '是否要覆盖当前文件夹的内容', type: 'confirm' }
        ])
        if (!isCover) {
          return
        }
      } catch (error) {
        console.log(symbols.fail, chalk.red('项目初始化失败，已退出!'))

        return
      }
    }
    // 创建一个空的文件夹
    fs.emptyDirSync(targetProjectPath)

    try {
      // 将模板文件夹中的内容复制到目标文件夹（目标文件夹为命令输入所在文件夹）
      fs.copySync(sourceProjectPath, targetProjectPath)
      console.log(symbols.success, chalk.green('已经成功拷贝 Template 文件夹下所有文件！'))
    } catch (err) {
      console.error(symbols.fail, chalk.red('项目初始化失败，已退出!'))
      return
    }

    // 设置项目的描述及作者名称等信息
    const { projectDescription, projectAuthor } = await inquirer.prompt([
      { name: 'projectDescription', message: '请输入项目描述' },
      { name: 'projectAuthor', message: '请输入作者名字' }
    ])

    const meta = {
      projectAuthor,
      projectDescription,
      projectName
    }

    const targetPackageFile = targetProjectPath + '/package.json'
    if (fs.pathExistsSync(targetPackageFile)) {
      // 读取文件，并转换成字符串模板
      const content = fs.readFileSync(targetPackageFile).toString()
      // 利用 handlebars 将需要的内容写入到模板中
      const result = handlebars.compile(content)(meta)
      fs.writeFileSync(targetPackageFile, result)
    } else {
      console.log('package.json 文件不存在：' + targetPackageFile)
    }

    // 安装依赖
    await tryYarn(targetProjectPath)

    // 初始化 git
    tryInitGit(targetProjectPath)

    console.log(symbols.success, chalk.green('项目初始化完成!'))
  })

program.parse(process.argv)
