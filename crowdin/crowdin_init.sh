echo "Hello World"
### Check if the nvm is installed or not
if [ ! -d ~/.nvm ]; then
    echo "Please install, nvm and install node LTS"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    command -v nvm
else
    echo "NVM installed already"
fi

if ! type "node" > /dev/null; then
    echo "Install node LTS version"
    nvm install node
else
    echo "Node already installed"
    echo "Installing required packages"
    cd ./js && npm install && cd ..
fi