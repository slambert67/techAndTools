#!/bin/ksh
# #########################
# Script to install utPLSQL
# #########################

dir=$(dirname $0)

cd $dir/../utplsql
if [ -f utPLSQL.zip ]
then
   rm -fr utPLSQL
   unzip -q utPLSQL.zip
   if [ -d utPLSQL/source -a -f utPLSQL/source/install_headless.sql ]
   then
      cd utPLSQL/source
      sqlplus -s ${APPN_DATABASE} as sysdba << EOF
      drop user ut3 cascade;
      @install_headless.sql ut3 XNtxj8eEgA6X6b6f users
      quit
EOF
   else
      echo "No utPLSQL source found - exitting"
      echo -1
   fi
else
   echo "No utPLSQL install file found - exitting"
   echo -1
fi



