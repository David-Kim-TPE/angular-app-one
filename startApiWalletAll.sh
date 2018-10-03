export COMPOSER_PROVIDERS=`cat passport-all.json`
export WEB_SERVER_URL='http://localhost:4200/'
echo COMPOSER_PROVIDERS: $COMPOSER_PROVIDERS
echo WEB_SERVER_URL: $WEB_SERVER_URL
composer-rest-server -c admin@my-basic-sample-network -n never -a true -m true -u true -w true --port 3000
