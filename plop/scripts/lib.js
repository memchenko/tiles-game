const fs = require('fs');
const path = require('path');
const { capitalize } = require('./utils');

const files = [
    'types',
    'index',
];

module.exports = (plop) => {
    plop.setGenerator(
        'lib',
        {
            description: 'react lib boilerplate',
            prompts: [
                {
                    type: 'input',
                    name: 'libName',
                    message: 'Specify name of the lib: lower case; if it consists of few words then separate it with comma',
                },
            ],
            actions: [
                (answers) => {
                    process.chdir(plop.getPlopfilePath());

                    const libNameWords = answers.libName.split(',').map(word => word.trim());
                    const modifiedAnswers = {
                        ...answers,
                        libName: {
                            camelCased: [libNameWords[0]].concat(libNameWords.slice(1).map(capitalize).join('')),
                            capitalized: libNameWords.map(capitalize).join(''),
                            kebabCased: libNameWords.join('-'),
                        },
                        files: files.reduce((acc, fileName) => {
                            acc[fileName] = true;
                            return acc;
                        }, {}),
                    };
                    const mapFileNameToConfig = (fileName) => {
                        return {
                            directory: `./src/lib/${modifiedAnswers.libName.kebabCased}`,
                            fileName: `${fileName}.ts`,
                            templateFilePath: `./plop/templates/lib/${fileName}.hbs`,
                        };
                    };
                    const filesToCreate = files
                        .filter(fileName => modifiedAnswers.files[fileName])
                        .map(mapFileNameToConfig)
                        .concat({
                            directory: `./src/lib/${modifiedAnswers.libName.kebabCased}`,
                            fileName: `${modifiedAnswers.libName.kebabCased}.ts`,
                            templateFilePath: `./plop/templates/lib/lib.hbs`,
                        });
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