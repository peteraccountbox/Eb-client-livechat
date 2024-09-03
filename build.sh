npm run build

# CDN MAPPING
if [ "$1" ]; then

npx wrangler r2 object put reacho-file-repo/onsite/js/chat/loader/main.min.js --file=/Users/vaishnavireddy/Documents/EngageBay/reacho/Reacho-client-livechat/build/loader/main.min.js

npx wrangler r2 object put reacho-file-repo/onsite/js/chat/main/main.min.js --file=/Users/vaishnavireddy/Documents/EngageBay/reacho/Reacho-client-livechat/build/main/main.min.js

else
    echo "No CDN2"  


fi   
