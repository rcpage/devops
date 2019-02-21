# devops

### Ansible Tower 3.4 contains a variety of enhancements and new features, including:

- Expanded and Enhanced Workflows, including:
- Inventory overrides
- Convergence nodes
- Workflow Nesting
- Job Distribution for scaling large jobs
- Support for deployment in FIPS-enabled environments

### Installing Ansible Tower 3.4 on RHEL
  1. Clone DevOps Repository
  2. Install Ansible Engine on RHEL System
  3. Run playbook to install Ansible Tower
  4. Launch Ansible Tower on localhost
  
### Clone DevOps Repository
```sh
git clone https://github.com/rcpage/devops.git
```

### Install Ansible Engine on RHEL System
```sh
yum install ansible -y
```

### Run playbook to install Ansible Tower
```sh
ansible-playbook devops/ansible/playbooks/install-ansible-tower-3.4.yml --extra-vars="admin_password=12345"
```
console output:
```sh
PLAY [Install Ansible Tower 3.4 on localhost]
TASK [Gathering Facts]
TASK [Downloading...https://releases.ansible.com/ansible-tower/setup/ansible-tower-setup-3.4.0-2.tar.gz]
TASK [Unpack ansible-tower-setup-3.4.0-2.tar.gz] 
TASK [Generate Ansible Tower Inventory File] 
TASK [RUNNING 'ansible-tower-setup-3.4.0-2/setup.sh' WILL TAKE A WHILE!!]
```

### Launch Ansible Tower on localhost (License Key Required)
https://localhost



