const fs = require('fs');
const path = require('path');
const { capitalize } = require('./utils');

const files = [
    'styles',
    'component',
    'index',
    'types',
];

const componentTypes = [
    'components',
    'screens',
];

module.exports = (plop) => {
    plop.setGenerator(
        'react-component',
        {
            description: 'react component boilerplate',
            prompts: [
                {
                    type: 'input',
                    name: 'entityName',
                    message: 'Specify name of the entity: lower case; if it consists of few words then separate it with comma',
                },
                {
                    type: 'list',
                    name: 'componentType',
                    message: 'Folder to put component in',
                    choices: componentTypes,
                },
            ],
            actions: [
                (answers) => {
                    process.chdir(plop.getPlopfilePath());

                    const entityNameWords = answers.entityName.split(',').map(word => word.trim());
                    const modifiedAnswers = {
                        ...answers,
                        entityName: {
                            capitalized: entityNameWords.map(capitalize).join(''),
                        },
                    };
                    const mapFileNameToConfig = (fileName) => {
                        const name = ['component', 'styles'].includes(fileName)
                            ? modifiedAnswers.entityName.capitalized
                            : fileName;
                        const ext = fileName === 'styles' ? 'scss' : 'ts';
                        return {
                            directory: `./src/${modifiedAnswers.componentType}/${modifiedAnswers.entityName.capitalized}`,
                            fileName: `${name}.${ext}`,
                            templateFilePath: `./plop/templates/component/${fileName}.hbs`,
                        };
                    };
                    const filesToCreate = files
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