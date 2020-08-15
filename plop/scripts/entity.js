const fs = require('fs');
const path = require('path');
const { capitalize } = require('./utils');

const files = [
    'types',
    'actions',
    'reducers',
    'constants',
    'epics',
];

module.exports = (plop) => {
    plop.setGenerator(
        'entity',
        {
            description: 'react entity boilerplate',
            prompts: [
                {
                    type: 'input',
                    name: 'entityName',
                    message: 'Specify name of the entity: lower case; if it consists of few words then separate it with comma',
                },
                {
                    type: 'checkbox',
                    name: 'files',
                    message: 'Choose files to generate',
                    choices: files,
                },
            ],
            actions: [
                (answers) => {
                    process.chdir(plop.getPlopfilePath());

                    const entityNameWords = answers.entityName.split(',').map(word => word.trim());
                    const modifiedAnswers = {
                        ...answers,
                        entityName: {
                            camelCased: [entityNameWords[0]].concat(entityNameWords.slice(1).map(capitalize).join('')),
                            capitalized: entityNameWords.map(capitalize).join(''),
                            kebabCased: entityNameWords.join('-'),
                            capsLocked: entityNameWords.map(word => word.toUpperCase()).join('_')
                        },
                        files: files.reduce((acc, fileName) => {
                            acc[fileName] = answers.files.includes(fileName);
                            return acc;
                        }, {}),
                    };
                    const mapFileNameToConfig = (fileName) => {
                        return {
                            directory: `./src/entities/${modifiedAnswers.entityName.kebabCased}`,
                            fileName: `${fileName}.ts`,
                            templateFilePath: `./plop/templates/entity/${fileName}.hbs`,
                        };
                    };
                    const filesToCreate = files
                        .filter(fileName => modifiedAnswers.files[fileName])
                        .map(mapFileNameToConfig)
                        .concat(mapFileNameToConfig('index'));
                    const cwd = process.cwd();

                    for (const data of filesToCreate) {
                        const directoryPath = path.join(cwd, data.directory);
                        const filePath = path.join(directoryPath, data.fileName);
                        const templateFilePath = path.join(cwd, data.templateFilePath);
                        const template = fs.readFileSync(templateFilePath, { encoding: 'utf8' });
                        const content = plop.renderString(template, modifiedAnswers);

                        if (!fs.existsSync(filePath)) {
                            fs.mkdirSync(data.directory, { recursive: true });
                            fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'wx' });
                        }
                    }
                },
            ],
        }
    );
};