# playbook install/uninstall

```sh
#install nodejs

#RHEL
> yum install nodejs

#Fedora
> dnf install nodejs

> git clone https://github.com/rcpage/devops.git
> cd devops/ansible/tools/playbook

#install playbook to /usr/bin/
> ./install.sh

#uninstall playbook from /usr/bin/
> ./uninstall.sh

```

# playbook usage

```

Usage:	playbook [action] [args] [-options] [--task-fields]
[actions]
	- task		Manage task files
	- project	Manage project playbook
	- read		Read project JSON or YAML files

[args]
	task
	 - description
	 - module name
	 - module params (JSON format)

	project
	 - [command]
		 - create	[playbook name]	Creates new playbook project
		 - build					Builds playbook from tasks		
		 - readme					Autogenerate playbook README.md

	read
	 - filename (YAML and JSON formats only)

[-options]
	-h		Human readable YAML document (defaults to JSON document)
	-w		Write output as .yml or .json (defaults to .json)

[--task-fields]

	Task fields add properties to playbook tasks

```

### Create new project

```sh
> playbook project create "Example Project"
> cd "Example Project"
> tree .
"Example Project"
├── playbook.json
├── resources
├── tasks
├── tasks.json
└── vars.json
```

### Add tasks to project

```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }" -wa
```

```sh
> playbook task "Debug exampleVar" debug "var=exampleVar" -wa
```

### Build project playbook YAML

```sh
> playbook project build -hw #creates project.yml
```

### List playbook tasks

```sh
> ansible-playbook playbook.yml --list-tasks

playbook: playbook.yml

  play #1 (all): Example Project	TAGS: []
    tasks:
      Set playbook variable Hello World	TAGS: [hello, playbook, set, variable, world]
      Debug exampleVar	TAGS: [debug, examplevar]
```

### Run playbook

```sh
> ansible-playbook playbook.yml --user [username] --ask-pass --extra-vars="variable_host=[ip address or hostname]"
SSH password: 

PLAY [Example Project]

TASK [Gathering Facts] 
ok: [localhost]

TASK [Set playbook variable Hello World] 
ok: [localhost]

TASK [Debug exampleVar] 
ok: [localhost] => {
    "exampleVar": "Hello World"
}

PLAY RECAP 
localhost                  : ok=3    changed=0    unreachable=0    failed=0   

```

# Examples


## Read playbook.json file

```sh
> playbook read playbook.json
{
  "name": "Example Project",
  "hosts": "all",
  "vars": "vars.json",
  "gather_facts": "yes",
  "tasks": "tasks.json"
}
```

## Read vars.json file

```sh
> playbook read vars.json 
{} # Note empty object
```
## Read tasks.json file

```sh
> playbook read vars.json 
[] # Note empty array
```

## Output example task to console (JSON format)
```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }"
{
  "filename": "set-playbook-variable-hello-world.json",
  "task": {
    "name": "Set playbook variable Hello World",
    "set_fact": {
      "exampleVar": "Hello World"
    },
    "tags": [
      "set",
      "playbook",
      "variable",
      "hello",
      "world"
    ]
  },
  "path": "./tasks/set-playbook-variable-hello-world.json"
}

> playbook task "Debug exampleVar" debug "var=exampleVar"
{
  "filename": "debug-examplevar.json",
  "task": {
    "name": "Debug exampleVar",
    "debug": "var=exampleVar",
    "tags": [
      "debug",
      "examplevar"
    ]
  },
  "path": "./tasks/debug-examplevar.json"
}
```
## Output example task to console (YAML format)
```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }" -h
filename: set-playbook-variable-hello-world.yml
task:
  name: Set playbook variable Hello World
  set_fact:
    exampleVar: Hello World
  tags:
    - set
    - playbook
    - variable
    - hello
    - world
path: ./tasks/set-playbook-variable-hello-world.yml

> playbook task "Debug exampleVar" debug "var=exampleVar" -h
filename: debug-examplevar.yml
task:
  name: Debug exampleVar
  debug: var=exampleVar
  tags:
    - debug
    - examplevar
path: ./tasks/debug-examplevar.yml
```

## Options [-wa] creates file in tasks folder and appends filename to tasks.json array

***Write "Set playbook variable Hello World" then append filename to tasks.json***
```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }" -wa
Task "set-playbook-variable-hello-world.json" has been written to "./tasks/set-playbook-variable-hello-world.json"
Task list has been updated.
```
***Write Debug exampleVar then append filename to tasks.json***

```sh
> playbook task "Debug exampleVar" debug "var=exampleVar" -wa
Task "debug-examplevar.json" has been written to "./tasks/debug-examplevar.json"
Task list has been updated.
```

***Note: read tasks.json file after command***
```sh
> playbook read tasks.json 
[
  "./tasks/set-playbook-variable-hello-world.json",
  "./tasks/debug-examplevar.json"
]
```

## Output playbook build after adding task to console
```sh
> playbook project build
[
  {
    "name": "Example Project",
    "hosts": "all",
    "vars": {},
    "gather_facts": "yes",
    "tasks": [
      {
        "name": "Set playbook variable Hello World",
        "set_fact": {
          "exampleVar": "Hello World"
        },
        "tags": [
          "set",
          "playbook",
          "variable",
          "hello",
          "world"
        ]
      },
      {
        "name": "Debug exampleVar",
        "debug": "var=exampleVar",
        "tags": [
          "debug",
          "examplevar"
        ]
      }
    ]
  }
]
```

## Review playbook.yml

```sh
playbook project build -h
---
- name: Example Project
  hosts: all
  vars: {}
  gather_facts: 'yes'
  tasks:
    - name: Set playbook variable Hello World
      set_fact:
        exampleVar: Hello World
      tags:
        - set
        - playbook
        - variable
        - hello
        - world
    - name: Debug exampleVar
      debug: var=exampleVar
      tags:
        - debug
        - examplevar
```
## Write playbook.yml to project folder

```sh
> playbook project build -hw
Playbook has been written.
```

## Verify playbook YAML by listing tasks using 'ansible-playbook' command

```sh
> ansible-playbook playbook.yml --list-tasks

playbook: playbook.yml

  play #1 (all): Example Project	TAGS: []
    tasks:
      Set playbook variable Hello World	TAGS: [hello, playbook, set, variable, world]
      Debug exampleVar	TAGS: [debug, examplevar]
```

## Verify playbook using 'ansible-playbook' command

```sh
> ansible-playbook playbook.yml --user [username] --ask-pass --extra-vars="variable_host=[ip address or hostname]"
SSH password: 

PLAY [Example Project] 

TASK [Gathering Facts] 
ok: [localhost]

TASK [Set playbook variable Hello World] 
ok: [localhost]

TASK [Debug exampleVar] 
ok: [localhost] => {
    "exampleVar": "Hello World"
}

PLAY RECAP 
localhost                  : ok=3    changed=0    unreachable=0    failed=0   

```
