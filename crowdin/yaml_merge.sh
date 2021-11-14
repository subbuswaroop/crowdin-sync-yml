#!/bin/bash
# echo $2
# echo $3
# language mappings
declare -a  provider_code=("es-ES ja es-MX no pt pt ru sv")
declare -a  app_code=("es" "ja-JP" "es-LA" "nb-NO" "pt-BR" "pt-PT" "ru-RU" "sv-SE")

source_dir=../locales-yml
new_dir=$1
echo "${source_dir}/$2"
# base_lang='en'
# cp $source_dir/en.yml old.yaml
# echo "copied over"

# lang_index=0
# for lang in $provider_code;  do
#   move_dir $new_dir/$lang $new_dir/${app_code[lang_index]}
#   echo "copied over $lang -> ${app_code[lang_index]}"
#   rm -rf "$new_dir/$lang"
#   echo "deleted $lang"

#   ((lang_index=lang_index+1))
# done




# move_dir(){
#   src=$1
#   dest=$2
#   if [ -d "$src" ]
#   then
#     echo "moving $1 to $2"
#     mv "$1" "$2"
#   fi
# }

install_yaml_merge(){
  command -v npm  || echo "NPM not installed. Exiting"
  npm install -g @alexlafroscia/yaml-merge
}

command -v yaml-merge >/dev/null 2>&1 || install_yaml_merge

yaml-merge "${source_dir}/$2" new.yaml | sed -e 's/\\_/ /g' > "${source_dir}/$2"

# if [ $# -lt 2 ]
# then
#   echo "usage ./merge_translations.sh <dir_with_new_files> <helpkit_locale_dir>"
#   exit 1;
# fi

# # TODO:
# # Add other mappings like PT-BR, pt-pt, sv-se
# # automate parent key change

# # language mappings
# declare -a  provider_code=("es-ES ja es-MX no pt pt ru sv")
# declare -a  app_code=("es" "ja-JP" "es-LA" "nb-NO" "pt-BR" "pt-PT" "ru-RU" "sv-SE")

# lang_index=0
# for lang in $provider_code;  do
#   move_dir $new_dir/$lang $new_dir/${app_code[lang_index]}
#   echo "copied over $lang -> ${app_code[lang_index]}"
#   rm -rf "$new_dir/$lang"
#   echo "deleted $lang"

#   ((lang_index=lang_index+1))
# done

# for lang in `ls $1`
# do
#   if [ $lang == $base_lang ]
#   then
#     echo "Skipped base lang $base_lang"
#   else
#     filename=`ls $1/$lang`
#     cp $new_dir/$lang/$filename new.yaml
#     echo "$source_dir/${lang}.yml"
#     cp $source_dir/${lang}.yml old.yaml
#     yaml-merge old.yaml new.yaml | sed -e 's/\\_/ /g' > "${source_dir}/${lang}.yml"
#     #java -jar yaml-merge.jar old.yaml new.yaml "${source_dir}/${lang}.yml"
#     echo "copied over $lang"
#   fi
# done

# rm old.yaml
# rm new.yaml