'use strict';

const generators   = require('yeoman-generator');
const fileReader   = require('html-wiring');
const ucfirst      = require('ucfirst');
const routePrompt  = require('./routes.prompt');
const methodPrompt = require('./method.prompt');
const routeTools   = require('./route-tools');

/**
 * The route subgenerator
 */
const serverGenerator = generators.Base.extend({
    prompting: {
        ask() {
            return this.prompt(routePrompt).then((answers) => {
                this.routes = answers.routes.map(routeTools.genRoutesNames);
            });
        },
        method() {
            const prompts = _.reduceRight(routes,
                (route) => (result, question) => {
                return _.union(result, methodPrompt(route));
            }, []);
            return this.prompt(prompts).then((answers) => {
                this.routes.forEach((route) => {
                    route.method = answers[`method-${route.camelName}`];
                });
            });
        },
    },
    writing: {
        /**
         * Copies files from template to route
         * @param  {Object} route Object containing route info
         * @param  {String} from String path
         * @param  {String} to String path
         */
        copy(route, from, to) {
            // All good
            this.fs.copyTpl(
                this.templatePath(from),
                this.destinationPath(to,
                    {
                        fileName: route.slugName,
                        classBaseName: ucfirst(route.camelName),
                    }));
        },
        /**
         * Checks if a route exists
         * @param  {Object} route Object containing route info
         * @return {Boolean} exists
         */
        exists(route) {
            return _.get(
                this.destinationPath(`src/handlers/${route.slugName}.js`, false)
            );
        },
        /**
         * Filters route array if a route exists
         * @param  {Array} routes Array containing route names
         * @return {Array} routes
         */
        filterRoutes(routes) { // We check the route doesn't already exists
            return _.dropWhile(routes, ((route) => {
                return !this.exists(route);
            }));
        },
        routes() {
            // We get the serverless.yml file as a string
            const path = this.destinationPath('serverless.yml');
            const input = fileReader.readFileAsString(path);

            const filteredRoutes = filterRoutes(this.routes);

            // We process each route
            filteredRoutes.forEach((route) => {
                const envVars = {
                    fileName: route.slugName,
                    classBaseName: ucfirst(route.camelName),
                };

                this.log(`Route ${route.slugName} already exists`);

                // All good
                this.copy('./../../app/templates/src/handlers/foo.js',
                    `src/handlers/${route.slugName}.js`,
                    envVars);constructor

                this.copy('./../../app/templates/src/libs/foo/foo.service.js',
                    `src/libs/${route.slugName}/${route.slugName}.service.js`,
                    envVars);

                routeTools.updateYamlFile(route, input);

                // We add the unit test for the route
                this.copy(
                    './../../app/templates/test/foo/foo.test.js',
                    `test/${route.slugName}/${route.slugName}.test.js`,
                    envVars
                );

                // Once done we rewrite the serverless.yml file
                this.write(path, file);
            });
        },
    },
});

module.exports = serverGenerator;
