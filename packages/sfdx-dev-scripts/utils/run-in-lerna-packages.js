const { readdirSync } = require('fs');
const { join } = require('path');
const shell = require('shelljs');

shell.set('-e');
shell.set('+v');

const packageRoot = require('../utils/package-root');

module.exports = script => {
    // Only get lerna packages that require @salesforce/dev-scripts
    const packageList = readdirSync(join(packageRoot, 'packages')).filter(name => {
        try {
            const pjson = require(join(packageRoot, 'packages', name, 'package.json'));
            return pjson.dependencies['@salesforce/dev-scripts'] || pjson.devDependencies['@salesforce/dev-scripts'];
        } catch (e) {}
        return false;
    });

    console.warn(`Running '${script}' for packages ${packageList.join(', ')}`);

    try {
        packageList.forEach(dir => {
            shell.exec(`${script}`, {
                cwd: join(packageRoot, 'packages', dir)
            });
        });
    } catch(err) { 
        console.error(err);
        process.exitCode = 1;
    }
}
