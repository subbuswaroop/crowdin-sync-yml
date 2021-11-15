#!/bin/bash
source_dir=../locales-yml/mint_translations
tmp_file=$1

install_yaml_merge(){
  command -v npm  || echo "NPM not installed. Exiting"
  npm install -g @alexlafroscia/yaml-merge
}

command -v yaml-merge >/dev/null 2>&1 || install_yaml_merge

yaml-merge "${source_dir}/$2.yml" "./tmp/$tmp_file" | sed -e 's/\\_/ /g' > "${source_dir}/$1"
echo "copied over ${tmp_file}"

rm "./tmp/$tmp_file"