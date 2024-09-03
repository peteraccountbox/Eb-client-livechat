
# ENGAGEBAY_FOLDER_PATH="/home/eb137/IdeaProjects/engagebay-maven";
# mkdir -p $ENGAGEBAY_FOLDER_PATH/src/main/webapp/livechat-preview/js
mkdir -p /home/eb137/Documents/reacho-frontend/public/assets/chat-preview/
# mkdir -p $ENGAGEBAY_FOLDER_PATH/src/main/webapp/livechat-preview/css

# cd build/preview
# cp -r preview.*.js $ENGAGEBAY_FOLDER_PATH/src/main/webapp/livechat-preview/js/preview.js
# cp -r preview.*.js.map $ENGAGEBAY_FOLDER_PATH/src/main/webapp/livechat-preview/js/preview.js.map

cp -r build/* /home/eb137/Documents/reacho-frontend/public/assets/chat-preview/

# cd ../
# cp -r css $ENGAGEBAY_FOLDER_PATH/src/main/webapp/livechat-preview/css/

npm run build

# CDN MAPPING
<<<<<<< HEAD
# if [ "$1" ]; then
#     echo $1
#     # /bin/bash theme.sh

#     mkdir -p $1
#     rm -r $1/*
#     cp -r build/* $1/
    
#     ## Make the ZIP
#     zip -r $1.zip $1

#     ## Send to CDN
    
#     scp -i $EC2_PERMISSIONS $1.zip ec2-user@ec2-34-220-92-194.us-west-2.compute.amazonaws.com:~/livechat-react/
#     ssh -i $EC2_PERMISSIONS ec2-user@ec2-34-220-92-194.us-west-2.compute.amazonaws.com "unzip -o livechat-react/$1 -d livechat-react/ && rm -r livechat-react/$1.zip"
#     echo "Updated CDN version : $1"

#     rm -r $1
#     rm -r $1.zip

# aws cloudfront create-invalidation \
#   --distribution-id EPERQ90RQTF6Q \
#   --paths "//livechat-react/$1/*"

# aws cloudfront create-invalidation \
#   --distribution-id EPERQ90RQTF6Q \
#   --paths "/livechat-react/$1/*"
if [ "$1" ]; then

npx wrangler r2 object put reacho-file-repo/onsite/js/chat/loader/main.min.js --file=/Users/vaishnavireddy/Documents/EngageBay/reacho/Reacho-client-livechat/build/loader/main.min.js

npx wrangler r2 object put reacho-file-repo/onsite/js/chat/main/main.min.js --file=/Users/vaishnavireddy/Documents/EngageBay/reacho/Reacho-client-livechat/build/main/main.min.js

# else
#     echo "No CDN2"  


# fi   
