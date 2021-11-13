class DASLInterface {
    constructor() {
        this.exp = {ops:['*', '/', '+', '-', '@']};
        this.global = {variables: {}};
        this.private = {cache: {openerCache: '', isFinished: false}}
        this.out = '';
        this.opener = null;
        this.handlers = {
            raise: msg => {
                this.errorMessage = msg;
            },
            listen: msg => {
                /**On error. Message will be passed in. */
            }
        }
        this.prim = {
            Manager: {
                send: (mes, ...r) => {
                    this.out += '\n'+mes
                    r.forEach(item => {
                        this.out+= '\n'+item;
                    })
                }
            }
        };
    }

    register(name,type,value) {
        if(type === 'int' && this.isInt(value))
        this.global.variables[name] = parseInt(value);
    }
    isInt(int){
        if(!int.includes('"') && int.includes('1')) return true;
        if(!int.includes('"') && int.includes('2')) return true;
        if(!int.includes('"') && int.includes('3')) return true;
        if(!int.includes('"') && int.includes('4')) return true;
        if(!int.includes('"') && int.includes('5')) return true;
        if(!int.includes('"') && int.includes('6')) return true;
        if(!int.includes('"') && int.includes('7')) return true;
        if(!int.includes('"') && int.includes('8')) return true;
        if(!int.includes('"') && int.includes('9')) return true;
        if(!int.includes('"') && int.includes('0')) return true;
    }
    dev() {
        this.devMode = true;
    }
    exe(code) {
        this.errorMessage = undefined;
        code.split('\n').forEach((line, index) => {
            // TODO clear temp cache open close bracket,
            // todo also fix obj declr problems
            if(!line.includes('\\\\')){
            
                if(this.opener){
                    
                    let info = this.opener;
                    if(info.type.includes('obj')){
                        try {
                            let key = line.split(':')[0].trim();
                            let value = line.split(':')[1].trim();
                            console.log(key, value);
                            this.private.cache.openerCache += key+':'+this.evaluate(value)+',';
                        } catch {}
                    }
                    this.ok();
                }
                if(this.firstWord(line) === 'store'){
                    console.log(line);
                    let info = this.splitIntoVarDeclr(line);
                    if(info.type === 'int' && this.isInt(info.value)){
                        this.global.variables[info.name] = parseInt(this.evaluate(info.value));
                    }
                    if(info.type === 'str' && info.value.includes('\'')){
                        this.global.variables[info.name] = this.removeStringChars(this.evaluate(info.value));
                    }
                    if(info.type.includes('obj')){
                        if(info.value === '{') {
                            this.opener = {to: info.name, type: info.type};
                        }
                    }
                    if(info.type === 'obj'){
                        console.log(info);
                        let res = JSON.parse(this.global.variables[info.value.split('.')[0]]);
                        let getChilds = info.value.split('.').forEach((item,index) => {
                            if(index !== 0){
                                res = res[item]
                            }
                        })
                        this.global.variables[info.name] = res;
                    }
                    this.ok();
                }

                Object.keys(this.global.variables).forEach(varname => {
                    if(this.firstWord(line) === varname) {

                    }
                })
                if(line.includes('Manager')){
                    let cmd = line.split(' ')[0];
                    if(cmd.split('.')[1].includes('send(')){
							let cont = this.evaluate(cmd
								.split('.')[1]
								.split('send(')[1]
								.split(')')[0].trim()
                            );
                            this.prim.Manager.send(cont)
                    }
                }


                if (this.opener && line.includes('}')) {
                    console.log(this.opener);
                    if(this.opener.type.includes('obj')){
                    this.global.variables[this.opener.to] = this.objectify(this.private.cache.openerCache)
                    }
                    else {
                        this.global.variables[this.opener.to] =
                        this.private.cache.openerCache
                    }
                    
                    this.private.cache.openerCache = null;
                    this.opener = null;
                    this.ok();
                }
            }
        });
        
        this.private.cache.isFinished = true;
        if(this.errorMessage)
        this.handlers.listen(this.errorMessage);
        this.nook();
    }
    objectify(target){
        let result = {};
        target.split(',').forEach(keyandval => {
            result[keyandval.split(':')[0]] = keyandval.split(':')[1]
        })
        return JSON.stringify(result);
    }
    ok() {
        this.isok = true;
    }
    nook() {
        this.isok = false;
    }
    removeStringChars(str) {
        let res = '';
        str.split('').forEach((char,index) => {
            if(index !== 0 && index !== str.length - 1) res += char
        })
        return res;
    }
    firstWord(str) {
        return str.split(' ')[0]
    }
    lastChar(str) {
        return str.split('')[str.split('').length - 1]
    }
    splitIntoVarDeclr(line){
        let name = line.split(' ')[1]
        let val = line.split(':')[1].replace(';','');
        let type = line.split('=')[1].trim().replace(':'+val+';','');
        return {name,type,value:val}
    }
    evaluate(exp) {
        let re_exp = exp;
        let containsOperations = false;
        this.exp.ops.forEach(operation => {
            if(exp.includes(operation)){
                if(!exp.includes('\''))
                Object.keys(this.global.variables).forEach(varKey => {
                    re_exp = re_exp.replaceAll(varKey, this.global.variables[varKey])
                })
                containsOperations = true;
            }
        })
        if(!containsOperations){
            if(!exp.includes('\''))
            Object.keys(this.global.variables).forEach(varKey => {
                re_exp = re_exp.replaceAll(varKey, this.global.variables[varKey])
            })
        }

        return containsOperations ? eval(re_exp) : re_exp;
    }
}