export WEB_SERVER_URL='http://localhost:4200/'
echo WEB_SERVER_URL: $WEB_SERVER_URL
composer-rest-server -c admin@my-basic-sample-network -n never -u true -w true --port 3001
