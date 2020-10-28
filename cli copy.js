#!/usr/bin/env node
// const promptList = [
//     // 具体交互内容
// ];

// inquirer.prompt(promptList).then(answers => {
//     console.log(answers); // 返回的结果
// })

// Inquirer
//   questions
//     type：提问类型，input, confirm, list, rawlist, expand, checkbox, password, editor
//     name：问题名称，供程序后续使用
//     message：问题文字，给用户看的
//     default：默认值
//     choices：选项
//     validate：输入验证
//     filter：数据过滤

// */
const program = require('commander') //可以解析用户输入的命令
const download = require('download-git-repo') //拉取github上的文件
const chalk = require('chalk') //改变输出文字的颜色
const inquirer = require('inquirer')
const ora = require('ora') //小图标（loading、succeed、warn等）
const fs = require('fs') //小图标（loading、succeed、warn等）

program.version('0.0.1', '-v, --vers', 'output the current version')
  .option('-i, init', '初始化j8项目')
  .parse(process.argv)
  .action(function(env, options){
      console.log(env.options[0])
  });

program.parse(process.argv)
const promptList = [{
        type: 'input',
        name: 'name',
        message: '请输入姓名',
        default: 'wanzi',
        validate(val) {
            if (val.trim() == '') {
                return '应用名称不能为空'
            } else {
                return true
            }
        },
        //对用户输入的数据或选择的数据进行过滤
        filter(val) {
            return val.toLowerCase()
        }
    },
    {
        type: 'confirm',
        name: 'xingbie',
        message: '是否同性恋',
        default: false
    }, {
        type: 'list',
        name: 'gongzi',
        message: '你的工资范围',
        choices: [
            '100-1000',
            '1000-2000'
        ],
        default: 1
    }, {
        type: 'rawlist',
        name: 'gongzi2',
        message: '你的工资范围',
        choices: [
            '100-1000',
            '1000-2000'
        ],
        default: 1
    }, {
        type: 'checkbox',
        name: 'tools',
        message: '你感兴趣的话题',
        choices: [{
            name: '美妆',
            value: 'meizhuang',
            checked: true
        }, {
            name: '明星',
            value: 'mingxing'
        }, {
            name: '八卦',
            value: 'bagua'
        }]
    }
]
if (program.options.length>0) {
    inquirer.prompt(promptList).then(answers => {
        // console.log(answers)
        // console.info(chalk.red( JSON.stringify(answers)));

        let downloadUrl = 'github:jzb1205/node-cli'
        const spinner = ora('正在从github下载...').start()
        download(downloadUrl, answers.name, function (err) {
            console.log(err)
            if (!err) {
              spinner.clear()
              console.info('')
              console.info(chalk.green('-----------------------------------------------------'))
              console.info('')
              spinner.succeed(['项目创建成功,请继续进行以下操作:'])
              console.info('')
              console.info(chalk.cyan(` -  cd ${answers.name}`))
              console.info(chalk.cyan(` -  npm install / yarn`))
              console.info(chalk.cyan(` -  npm run dev / yarn dev`))
              console.info('')
              console.info(chalk.gray(`devServer: http://localhost:${answers.port}`))
              console.info('')
              console.info(chalk.gray('参考文档: https://github.com/jzb1205/node-cli.git'))
              console.info('')
              console.info(
                chalk.green('-----------------------------------------------------')
              )
              console.info('')
      
              fs.readFile(
                `${process.cwd()}/${answers.name}/package.json`,
                (err, data) => {
                  if (err) throw err
                  let _data = JSON.parse(data.toString())
                  _data.name = answers.name
                  _data.description = answers.description
                  _data.version = answers.version
                  _data.port = answers.port
                  let str = JSON.stringify(_data, null, 4)
                  fs.writeFile(
                    `${process.cwd()}/${answers.name}/package.json`,
                    str,
                    function (err) {
                      if (err) throw err
                      process.exit()
                    }
                  )
                }
              )
            } else {
              spinner.warn([
                '发生错误，请在https://github.com/xxj95719/j8-cli/issues，Issues留言'
              ])
              process.exit()
            }
          })
    })
}