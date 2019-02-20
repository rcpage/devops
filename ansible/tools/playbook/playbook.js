var args = process.argv.slice(2);
var argv = require('optimist').argv;
var fs = require('fs');
var jsyaml = require('js-yaml');
var projectDir = './';
var taskDir =  projectDir + 'tasks/';
const log = function(){ return console.log.apply(console, arguments); }
const $0 = argv._[0] || '';
const $1 = argv._[1] || '';
const $2 = argv._[2] || '';
const $3 = argv._[3] || '';


switch($0){
  case "doc":
  case "task":
    var task = newTask(),
        formattedJSON = pretty(task),
        showYAML = argv.h === true,
        task = JSON.parse(formattedJSON),
        result = null;
    if(showYAML){
      result = jsyaml.dump(task)
    }
    else {
      result = formattedJSON;
    }
    if(argv.w){
      log('\n\nTask "'+task.id + '" has been written to "'+task.dest+'"\n\n');
      fs.writeFileSync(task.dest + task.id, result);
    }
    else {
      log(result);
    }
    break;
  case "project":
    var filename = argv.file;
    switch($1){
      case "readme":
        log(buildMarkup());
        break;
      case "build":
        var showYAML = argv.h === true,
            projectDir = argv.projectDir || './',
            taskDir = projectDir + 'tasks/';
        if(showYAML) log(buildPlaybookYAML(filename));
        else log(pretty(buildPlaybookJSON(filename)));
        break;
    }
    break;
  case "read":
    var filename = $1,
        ext = filename.split('.').pop();
    if(ext == 'yml' || ext == 'yaml'){
      log(fs.readFileSync(filename).toString());
    } else if(ext == 'json')
      log(pretty(readJSON(filename)));
    else
      log('File not supported.');
    break;
  default:
    var help = [
      'Usage:	playbook [action] [args] [-options] [--task-fields]',
      '[actions]',
      '	- task		Manage task files',
      '	- project	Manage project playbook',
      '	- read		Read project JSON or YAML files',
      '',
      '[args]',
      '	task',
      '	 - description',
      '	 - module name',
      '	 - module params (JSON format)',
      '',
      '	project',
      '	 - command (create, build, or readme)',
      '',
      '	read',
      '	 - filename (YAML and JSON formats only)',
      '',
      '[-options]',
      '	-h		Human readable YAML document (defaults to JSON document)',
      '	-w		Write output as .yml or .json (defaults to .json)',
      '',
      /*
      'Usage 1: playbook task "task description" module "json string" [--field=example]',
      '',
      'Example 1: playbook task "Do something important" file "{ path: /app/src/file.txt }" --become=yes',
      'Outputs:',
      '{',
      '  "filename": "do-something-important.json",',
      '  "task": {',
      '	"name": "Do something important",',
      '	"file": {',
      '		"path": "/app/src/file.txt"',
      '	},',
      '	"become": "yes",',
      '	"tags": [',
      '		"do",',
      '		"something",',
      '		"important"',
      '	]',
      '  },',
      '  "dest": "./"',
      '}',
      '',
      '',
      'Usage 2: playbook project build [options]',
      '',
      'Example 1: playbook project build',
      'Output:',
      '{',
      '	"name": "Example Playbook",',
      '	"hosts": "all",',
      '	"vars": "{}",',
      '	"gather_facts": "yes",',
      '	"tasks": []',
      '}',
      '',
      '',
      'Usage 3: playbook read filename [options]',
      */
    ];
    log(help.join('\n'));
}

function pretty(json){
  return JSON.stringify(json, null, 2);
}

function getOptions(){
  var ops = [];
  for(var i in args){
    var o = args[i];
    if(o.startsWith('--')){
      var name = o.substr(2, o.indexOf('=')-2),
          val = o.substr(o.indexOf('=') + 1);
      val = o.indexOf('{{') == -1 ? jsyaml.load(val): val;
      var opt = {name: name, value: val };
      //opt[name] = val;
      ops.push(opt);
    }
  } 
  return  ops;
}

function readJSON(filename){
  try {
    return JSON.parse(fs.readFileSync(filename));
  }
  catch(e){
    return null;
  }
}

function newTask(){
  var fields = [
    "name",
    "when",
    "become",
    "become_user",
    "module",
    "params",
    "vars",
    "tags",
    "with_items",
    "register",
    "notify",
    "ignore_errors"
  ];
  var task = {};
  var ops = getOptions();
  task.name = $1;
  task[$2] = $3.indexOf('{{') == -1 ? jsyaml.load($3): $3;
  for(var i in ops){
    task[ops[i].name] = ops[i].value;
  }
  var tags = [], words = task.name.split(' ');
  for(var i in words){
    tags.push(words[i].toLowerCase()); 
  }
  task.tags = tags;
  var filename = tags.join('-') + (argv.h ? '.yml':'.json');
  return { filename: filename, task: task, dest: projectDir };
}

function buildPlaybookYAML(filename){
  var playbook = readJSON(projectDir  + (filename || 'playbook.json')),
      taskFiles = readJSON(projectDir + playbook.tasks),
      tasks = [],
      vars = readJSON(projectDir + playbook.vars);
  for(var i in taskFiles){
    var task = readJSON(taskDir + taskFiles[i]);
    if(task == null){
      log(taskFiles[i], task);
    } else {
      tasks.push(task);
    }
  }
  //replace filenames with js objects
  playbook.tasks = tasks;
  playbook.vars = vars;
  var playbookYAML = "---\n" + jsyaml.dump([ playbook ]);
  return playbookYAML;
}

function buildPlaybookJSON(filename){
  return jsyaml.load(buildPlaybookYAML(filename));
}

function writePlaybook(filename, playbook){
  fs.writeFileSync(projectDir  + (playbook || 'playbook.yml'), buildPlaybookYAML(filename));
}

function writeREADME(){
  fs.writeFileSync(projectDir + 'README.md', buildMarkup());
}

function buildMarkup(){
  var markup = '# Playbook Tasks\n\n';


  var playbook = readJSON(projectDir  + 'playbook.json'),
      taskFiles = readJSON(projectDir + playbook.tasks),
      tasks = [],
      vars = readJSON(projectDir + playbook.vars);


  markup += '```json\n';

  markup += JSON.stringify(playbook, null, 2);

  markup += '\n```\n';

  markup +=  '| Tasks | Tags |\n';
  markup += '| ----- | ---- |\n';

  for(var i in taskFiles){
    var filename = taskFiles[i];
    var path = taskDir + filename;
    var task = readJSON(path);
    if(task == null){
      log(taskFiles[i], task);
    } else {
      tasks.push(task);
      markup += '|['+task.name+'](tasks/'+filename+')|'+task.tags.join(', ')+'|\n';
    }
  }

  return markup;
}


