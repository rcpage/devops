# Installing Playbook Utility

### 1. Clone devops project
```sh
> git clone https://github.com/rcpage/devops.git
> cd devops/ansible/tools/playbook
```

### 2. Install NodeJS
```sh
#RHEL
> yum install nodejs

#Fedora
> dnf install nodejs
```

### 3. install playbook to '/usr/bin'

```sh
> ./install.sh
```

### 4. uninstall playbook from /usr/bin/
```sh
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

# Getting Started

Quickly create your first project by following the steps to run playbook.yml using Ansible engine.

1. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#1-create-new-project" target="_blank">Create new project</a>
2. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#2-add-tasks-to-project" target="_blank">Add tasks to project</a>
3. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#3-build-project-playbook-yaml" target="_blank">Build project playbook YAML</a>
4. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#4-list-playbook-tasks" target="_blank">List playbook tasks</a>
5. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#5-run-playbook" target="_blank">Run playbook</a>
6. <a href="https://github.com/rcpage/devops/blob/master/ansible/tools/playbook/README.md#create-project-readmemd-template" target="_blank">Create README.md template</a>

### 1. Create new project

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

### 2. Add tasks to project

***Task-1: "Set playbook variable Hello World"***
```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }" -wa
```
***Task-2: "Debug exampleVar"***
```sh
> playbook task "Debug exampleVar" debug "var=exampleVar" -wa
```

### 3. Build project playbook YAML

```sh
> playbook project build -hw #creates project.yml
```

### 4. List playbook tasks

```sh
> ansible-playbook playbook.yml --list-tasks

playbook: playbook.yml

  play #1 (all): Example Project	TAGS: []
    tasks:
      Set playbook variable Hello World	TAGS: [hello, playbook, set, variable, world]
      Debug exampleVar	TAGS: [debug, examplevar]
```

### 5. Run playbook

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


### 6. Create project README.md
```sh
> playbook project readme
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

## Output example task to console (Defaults JSON format)
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
## Output example task to console (YAML format) with option [-h]
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

## Option [-w] writes file in tasks folder and option [-a] appends filename to tasks.json array

***Write task "Set playbook variable Hello World" then append filename to tasks.json***
```sh
> playbook task "Set playbook variable Hello World" set_fact "{ exampleVar: Hello World }" -wa
Task "set-playbook-variable-hello-world.json" has been written to "./tasks/set-playbook-variable-hello-world.json"
Task list has been updated.
```
***Write task "Debug exampleVar" then append filename to tasks.json***

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

## Create project README.md template

```sh
> playbook project readme
# Example Project
{
  "name": "Example Project",
  "hosts": "all",
  "vars": "vars.json",
  "gather_facts": "yes",
  "tasks": "tasks.json"
}
| Tasks | Tags |
| ----- | ---- |
|[Set playbook variable Hello World](./tasks/set-playbook-variable-hello-world.json)|set, playbook, variable, hello, world|
|[Debug exampleVar](./tasks/debug-examplevar.json)|debug, examplevar|
```
# Example Project
```json
{
  "name": "Example Project",
  "hosts": "all",
  "vars": "vars.json",
  "gather_facts": "yes",
  "tasks": "tasks.json"
}
```
| Tasks | Tags |
| ----- | ---- |
|[Set playbook variable Hello World](./tasks/set-playbook-variable-hello-world.json)|set, playbook, variable, hello, world|
|[Debug exampleVar](./tasks/debug-examplevar.json)|debug, examplevar|
