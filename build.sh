mkdir -p /home/eb137/IdeaProjects/engagebay-frontend/public/assets/chat-preview/
cp -r build/* /home/eb137/IdeaProjects/engagebay-frontend/public/assets/chat-preview/
cp -r build/* /home/eb137/IdeaProjects/engagebay-maven/src/main/webapp/livechat-react-unified
npm run build


if [ "$1" ]; then
  # Determine the base path based on $1
  if [ "$1" = "app" ]; then
    BASE_PATH="eb-file-repo/onsite/js"
  else
    BASE_PATH="eb-file-repo/onsite/js/$1"
  fi

  npx wrangler r2 object put $BASE_PATH/chat/main/main.min.js \ 
    --file=/home/eb137/Documents/Eb-client-livechat/build/main/main.min.js
    --remote

  npx wrangler r2 object put $BASE_PATH/chat/loader/main.min.js \
    --file=/home/eb137/Documents/Eb-client-livechat/build/loader/main.min.js
    --remote

else
  echo "No CDN2"  

fi   
