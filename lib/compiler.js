let {getAST, getDependencies, transform} = require('./parser')
let path = require('path')
let fs = require('fs')

module.exports = class Compiler {
    constructor(options) {
        const {entry, output} = options;
        this.entry = entry;
        this.output = output;
        this.modules = [];
    }

    run() {
        let self = this;
        const entryModule = this.buildModule(this.entry, true)
        this.modules.push(entryModule)
        entryModule.dependencies.forEach(dep => {
            let module = self.buildModule(dep);
            this.modules.push(module)
        })
        this.emitFiles()
    }

    buildModule(filename, isEntry) {
        let ast
        if (isEntry) {
            ast = getAST(filename)
        } else {
            ast = getAST(path.join(process.cwd(), './src', filename));
        }
        return {
            filename,
            dependencies: getDependencies(ast),
            source: transform(ast)
        }
    }

    emitFiles() {
        const outputpath = path.join(this.output.path, this.output.filename);

        let modules = ''
        this.modules.forEach(module => {
            modules += `'${module.filename}': function(require, module, exports) {${module.source}},`
        })
        let bundle = `(function(modules) {
            function require(moduleId) {
                var fn = modules[moduleId];
                var module = {exports:{}};
                fn(require, module, module.exports);
                return module.exports;
            }
            require('${this.entry}')
        })({${modules}});`

        fs.writeFileSync(outputpath, bundle, 'utf-8')
    }
}