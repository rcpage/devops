# playbook

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
	 - command (create, build, or readme)

	read
	 - filename (YAML and JSON formats only)

[-options]
	-h		Human readable YAML document (defaults to JSON document)
	-w		Write output as .yml or .json (defaults to .json)

[--task-fields]

	Task fields add properties to playbook tasks

```

# Examples

```sh
#
# Read playbook.json file
#
playbook read playbook.json
{
  "name": "Example Playbook",
  "hosts": "all",
  "vars": "vars.json",
  "gather_facts": "yes",
  "tasks": "tasks.json"
}

#
# Example output task file in JSON format to console
#
playbook task "Do something important" file "{ path: /app/src/file.txt }" --become=yes
{
  "filename": "do-something-important.json",
  "task": {
    "name": "Do something important",
    "file": {
      "path": "/app/src/file.txt"
    },
    "become": "yes",
    "tags": [
      "do",
      "something",
      "important"
    ]
  },
  "dest": "./"
}

#
# Example builds project.yml file from playbook.json file
#
playbook project build
{
  "name": "Example Playbook",
  "hosts": "all",
  "vars": "{}",
  "gather_facts": "yes",
  "tasks": []
}



```
