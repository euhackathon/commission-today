# The ouput of all these installation steps is noisy. 
# With this utility the progress report is nice and concise.
function install {
    echo installing $1
    shift
    apt-get -y install "$@" >/dev/null 2>&1
}

echo updating package information
apt-get -y update >/dev/null 2>&1

install 'development tools' build-essential curl

install Git git

echo installing RVM
sudo -u vagrant -H bash -l -c 'gpg --keyserver hkp://keys.gnupg.net \
  --recv-keys D39DC0E3 && curl --silent -L https://get.rvm.io | bash -s stable'

source /home/vagrant/.rvm/scripts/rvm

echo installing Ruby 2.1.3
sudo -u vagrant -H bash -l -c '/home/vagrant/.rvm/bin/rvm install ruby-2.1.3 \
  --binary --quiet-curl --autolibs=enabled && rvm alias create default 2.1.3'

echo installing Bundler
sudo -u vagrant -H bash -l -c 'gem install bundler -N'

install 'ExecJS runtime' nodejs

echo 'All done, carry on!'
