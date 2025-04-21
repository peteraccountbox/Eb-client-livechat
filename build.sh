mkdir -p /home/eb137/Documents/eb-ticketing-frontend/public/assets/chat-preview/
cp -r build/* /home/eb137/Documents/eb-ticketing-frontend/public/assets/chat-preview/
npm run build


if [ "$1" ]; then


npx wrangler r2 object put reacho-file-repo/onsite/js/chat/main/main.min.js --file=/home/eb137/Documents/Eb-client-livechat/build/main/main.min.js

npx wrangler r2 object put reacho-file-repo/onsite/js/chat/loader/main.min.js --file=/home/eb137/Documents/Eb-client-livechat/build/loader/main.min.js

else
  echo "No CDN2"  

fi   
