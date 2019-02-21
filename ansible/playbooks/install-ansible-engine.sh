subscription-manager attach --pool=`subscription-manager list --all --available --matches "*Extra Packages*" --pool-only`
yum -y install ansible
