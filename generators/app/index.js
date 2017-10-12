'use strict';

const generators = require('yeoman-generator');
const questions  = require('./app.prompts');
const _          = require('lodash');
const chalk      = require('chalk');
const yosay      = require('yosay');
const mkdirp     = require('mkdirp');


/**
 * Our main generator
 */
const serverGenerator = generators.Base.extend({
    core: {
        files: [
            '.eslintrc.json',
            '.gitattributes',
            '.gitignore',
            '.npmrc',
            'editorconfig',
            '.gitlab-ci.yml',
            'src/helpers/async.js',
            'src/helpers/response.js',
            'src/helpers/wrapper.js',
            ['src/libs/README.md', {/** template vars  */}],
            'jsdoc.conf.json',
            ['package.json', {/** template vars  */}],
            'serverless.yaml',
            'yarn.lock',
            'dotbox.json',
            'config.json',
            'src/libs/README.md',
            'src/helpers/lambawrapper.js',
        ],
    },
    prompting: {
        /**
         * A welcome message
         */
        welcome() {
            this.log(yosay(
                'Welcome to the ' + chalk.orange('Orangetheory ServerQL') + ' a serverless architecture for Orangetheory Fitness'
            ));
        },
        /**
         * Builds base project
         * @param  {Array} prompts Array containing project questions
         * @return  {Array} answers Array containing answers
         */
        ask() {
            return this.prompt(questions).then((answers) => {
                this.projectName = answers.projectName;
                this.projectOwner = answers.projectOwner;
                this.projectDescription = answers.projectDescription;
                this.projectVersion = answers.projectVersion;
                this.authorName = answers.authorName;
                this.authorEmail = answers.authorEmail;
            });
        },
    },

    /**
     * Copies files from template to project
     */
    writing() {
        _.each(this.core.files, ((file) => {
            return _.isArray(file)
                ? this.copyTemplate(file[0])
                : this.copyFile(file);
        }));
    },    
    // writing: {
    //     editorConfig() {
    //         this.fs.copy(
    //             this.templatePath('.editorconfig'),
    //             this.destinationPath('.editorconfig')
    //         );
    //     },
    //     eslint() {
    //         this.fs.copy(
    //             this.templatePath('.eslintrc.json'),
    //             this.destinationPath('.eslintrc.json')
    //         );
    //     },
    //     git() {
    //         this.fs.copy(
    //             this.templatePath('.gitattributes'),
    //             this.destinationPath('.gitattributes')
    //         );
    //         this.fs.copy(
    //             this.templatePath('.gitignore'),
    //             this.destinationPath('.gitignore')
    //         );
    //     },
    //     npm() {
    //         this.fs.copy(
    //             this.templatePath('.npmrc'),
    //             this.destinationPath('.npmrc')
    //         );
    //     },
    //     readMe() {
    //         this.fs.copyTpl(
    //             this.templatePath('README.md'),
    //             this.destinationPath('README.md'), {
    //                 projectName: this.projectName,
    //                 projectDescription: this.projectDescription,
    //             }
    //         );
    //     },
    //     jsdoc() {
    //         this.fs.copyTpl(
    //             this.templatePath('jsdoc.conf.json'),
    //             this.destinationPath('jsdoc.conf.json'), {
    //                 projectName: this.projectName,
    //             }
    //         );
    //     },
    //     packageJSON() {
    //         this.fs.copyTpl(
    //             this.templatePath('package.json'),
    //             this.destinationPath('package.json'), {
    //                 projectName: this.projectName,
    //                 projectDescription: this.projectDescription,
    //                 projectVersion: this.projectVersion,
    //                 authorName: this.authorName,
    //                 authorEmail: this.authorEmail,
    //             }
    //         );
    //     },
    //     serverlessYaml() {
    //         this.fs.copyTpl(
    //             this.templatePath('serverless.yml'),
    //             this.destinationPath('serverless.yml'), {
    //                 projectName: this.projectName,
    //             }
    //         );
    //     },
    //     yarn() {
    //         this.fs.copy(
    //             this.templatePath('yarn.lock'),
    //             this.destinationPath('yarn.lock')
    //         );
    //     },
    //     dotbox() {
    //         this.fs.copyTpl(
    //             this.templatePath('.dotbox.json'),
    //             this.destinationPath('.dotbox.json'), {
    //                 projectName: this.projectName,
    //                 projectOwner: this.projectOwner,
    //             }
    //         );
    //     },
    //     gitlabCi() {
    //         this.fs.copy(
    //             this.templatePath('.gitlab-ci.yml'),
    //             this.destinationPath('.gitlab-ci.yml')
    //         );
    //     },
    //     config() {
    //         this.fs.copy(
    //             this.templatePath('config.json'),
    //             this.destinationPath('config.json')
    //         );
    //     },
    //     src() {
    //         this.fs.copy(
    //             this.templatePath('src/libs/README.md'),
    //             this.destinationPath('src/libs/README.md')
    //         );
    //         this.fs.copy(
    //             this.templatePath('src/helpers/async.js'),
    //             this.destinationPath('src/helpers/async.js')
    //         );
    //         this.fs.copy(
    //             this.templatePath('src/helpers/response.js'),
    //             this.destinationPath('src/helpers/response.js')
    //         );
    //         this.fs.copy(
    //             this.templatePath('src/helpers/wrapper.js'),
    //             this.destinationPath('src/helpers/wrapper.js')
    //         );
    //     },
    // },
    install() {
        this.composeWith('serverless:route');
        this.npmInstall();
    },
    end() {
        this.log(
            yosay('Your project has been set up! \n Thanks and see you soon!')
        );
    },
});

module.exports = serverGenerator;
