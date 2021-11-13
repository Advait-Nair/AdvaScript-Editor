// Code Highlighting (ADVA-Prettify)
const codelines = document.querySelectorAll('.codeline');
const input = document.querySelector('.gettextinput');
const line = document.querySelector('.line');
const run = document.querySelector('.runprog');
const result = document.querySelector('.adva-result-code');
const crossRes = document.querySelector('.cross-res');
const title = document.querySelector('title');
const name = document.querySelector('.name');

title.innerHTML = `${name.value} | AdvaScript Editor v0.1b`;
name.addEventListener('keyup', e => title.innerHTML = `${name.value} | AdvaScript Editor v0.1b`);


crossRes.addEventListener('click', e => {result.style.display = 'none', input.style.zIndex = '0'});


result.style.display = 'none';
input.value = localStorage.getItem(name.value)
if(!localStorage.getItem(name.value)){
input.value = `store x = int:5;
store y = int:10;
store z = str:'How do you do?';
store a = obj:{
z: y
k: z
}
store m = obj:a;
\\\\ Ich bin eine schauspieler, ich habe einen sehr teuer hemd. 
`;
}

function saveCode(name, code) {
	localStorage.setItem(name, code)
}

let asdev = new DASLInterface;
function readCode() {
	return input.value;
}
function onRun() {
	saveCode(name.value, readCode());
	const DASL = new DASLInterface;
    result.style.display = 'block';
    input.style.zIndex = '-100';
	DASL.dev();
	DASL.handlers.listen = msg => {
		result.lastElementChild.innerHTML += `
		<h4 class="card-err">
		<div class="card-m">DASLExe</div>
		${msg}
		</h4>`;
	};
    DASL.exe(readCode());
	if(!DASL.errorMessage){
		result.lastElementChild.innerHTML += `
		<h4 class="card-suc">
		<div class="card-m">DASLExe</div>
		${DASL.out}
		</h4>`;
	}
	asdev = DASL;
}
document.querySelector('.commands').addEventListener('submit', e => {
	if(document.querySelector('.command').value === 'showall'){
		result.lastElementChild.innerHTML += `
		<h4 class="card-suc">
		<div class="card-m">CmdReturn</div>
		${JSON.stringify(asdev)}
		</h4>`;
	} else if(document.querySelector('.command').value.includes('jscmd')){
		eval(document.querySelector('.command').value.replace('jscmd:',''));
	}
	e.preventDefault();
})

const ap = new ADVAPrettify();

function prettify() {
    ap.code = readCode();
    ap.keys = [
		['store', 'kw_h'],
		['int', 'ty_h'],
		['str', 'ty_h'],
		['obj', 'ty_h'],
		['fn', 'fn_h'],
		['(', 'fn_h'],
		[')', 'fn_h'],
		['.', 'punct_h'],
		['[', 'punct_h'],
		[']', 'punct_h'],
		[',', 'punct_h'],
		[':', 'punct_h'],
		[';', 'punct_h'],
		['{', 'punct_h'],
		['}', 'punct_h'],
		['-', 'exp_h'],
		['+', 'exp_h'],
		['*', 'exp_h'],
		['@', 'exp_h'],
		['1', 'num_h'],
		['2', 'num_h'],
		['3', 'num_h'],
		['4', 'num_h'],
		['5', 'num_h'],
		['6', 'num_h'],
		['7', 'num_h'],
		['8', 'num_h'],
		['9', 'num_h'],
		['0', 'num_h'],
		['Manager', 'obj_h'],
		['send', 'obj_h'],
		['warn', 'obj_h'],
		['stop', 'obj_h'],
		['fn()', 'fn_h'],
	];
    ap.line = '.line'
    ap.tgt = '.code-content';
    ap.comment = '\\\\'
    ap.prettify();
};

prettify();


input.addEventListener('keyup', e => {
    prettify();
})
setInterval(prettify(),0)
run.addEventListener('click', e => onRun());