module OS
    def OS.windows?
        (/cygwin|mswin|mingw|bccwin|wince|emx/ =~ RUBY_PLATFORM) != nil
    end

    def OS.mac?
        (/darwin/ =~ RUBY_PLATFORM) != nil
    end

    def OS.unix?
        !OS.windows?
    end

    def OS.linux?
        OS.unix? and not OS.mac?
    end
end

## Plugins
unless Vagrant.has_plugin?("vagrant-docker-compose")
	raise 'Missing vagrant-docker-compose plugin! Make sure to install it by `vagrant plugin install vagrant-docker-compose`.'
end

unless Vagrant.has_plugin?("vagrant-env")
	raise 'Missing vagrant-env plugin! Make sure to install it by `vagrant plugin install vagrant-env`.'
end

if OS.windows?
    unless Vagrant.has_plugin?("vagrant-winnfsd")
    	raise 'Missing vagrant-winnfsd plugin! Make sure to install it by `vagrant plugin install vagrant-winnfsd`.'
    end
end

## Variables
$app_name = "sportywidedev.com"
$vbox_ip = "192.168.50.10"
$vbox_memory = 4096

print ENV['SW_POSTGRES_USER']

Vagrant.configure(2) do |config|
	config.ssh.extra_args = ["-t", "cd /vagrant; bash --login"]
	config.vm.box = "centos/7"
	config.env.enable
	config.vm.hostname = $app_name
	config.vm.network :private_network, ip: $vbox_ip
  
	config.vm.provider "virtualbox" do |vb|
		vb.memory = $vbox_memory
		vb.customize ["modifyvm", :id, "--name", "Sportywide"]
		vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
		vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
		vb.cpus = "2"
		vb.gui                   = true
  	end
  
	config.vm.synced_folder ".", "/vagrant", type: "nfs", mount_options: ["rw","async","fsc","nolock","vers=3","udp","rsize=32768","wsize=32768","hard","noatime","actimeo=2"]

	config.vm.provision "shell", path: "vagrant/scripts/set-env.sh", env: ENV.to_hash
	config.vm.provision "shell", inline: "sudo yum clean all && sudo yum makecache fast"
	config.vm.provision "shell", path: "vagrant/scripts/node.sh"

	config.vm.provision :docker
	
	config.vm.provision :docker_compose,
    	compose_version: "1.24.0"
        
	config.vm.provision "services",
		type: "shell",
		keep_color: true,
		privileged: false,
		run: "always",
		inline: <<-SCRIPT
			cd /vagrant
			docker-compose -f docker-core-services.yml up --build
		SCRIPT
end  
