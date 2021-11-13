class ADVAPrettify {
    constructor(code){
        this.code = code;
        this.keys = [];
        this.tgt = '';
        this.private = {cache: {input: null}}
    }
    prettify(){
        let block = this.code.split(';');
        let line = this.code.split('\n');
        let last1 = line[line.length - 1]
        let last2 = last1.split('');
        let result = '';
        let leftLine = '';
        line.forEach((cmd, index) => {
            leftLine += index+1 + ' '
            if(!cmd.includes(this.comment))
            result += `<span class="codeline">${cmd.replaceAll('/', '/')}</span>\n`;
            else 
            result += `<span class="codeline com_h">${cmd.replaceAll('/', '/')}</span>`;
            
            this.keys.forEach(key => {
                if(cmd.includes(key[0])){
                    result = result.replaceAll(key[0], `<span class="${key[1]}">${key[0]}</span>`)
                }
            });
        })
        this.code = result;
        
        document.querySelector(this.tgt).innerHTML = this.code;
        document.querySelector(this.line).innerHTML = leftLine;
        this.private.cache.input = this.code;
    }
}