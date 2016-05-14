var db;
 angular.module('myApp',['ionic']).config(['$controllerProvider', function($controllerProvider) {
    $controllerProvider.allowGlobals();
}])
.controller('MainCtrl', function($scope, $ionicPlatform, $ionicHistory) {
     $scope.dbOfferData = [];
     $scope.recommendationList =[];
     $scope.foodShow=false;
     $scope.food={discount:30};
     $scope.grocery={discount:30};
     $scope.foodClick = function(){
         if($scope.foodShow)
             $scope.foodShow = false;
         else
             $scope.foodShow = true;
     }
     $scope.customText ="";
     $scope.apply = function(){
         if($scope.customText.length > 0){
             db.transaction(function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS CUSTOMTEXT (text)');
                 tx.executeSql('SELECT * FROM CUSTOMTEXT',[], function(tx, result){
                    if(result.rows.length == 0){
                        tx.executeSql('INSERT INTO CUSTOMTEXT (text) VALUES (?)',[$scope.customText]);
                    }else{
                        tx.executeSql('UPDATE CUSTOMTEXT SET text=?',[$scope.customText], function(tx,re){

                        },errorCB);
                    }
                },errorCB);
            }, errorCB, successCB);
         }

         //Grocery
         var bogo ='false', homeDelivery ='false', discount =30, tomoto = 'false',onion = 'false',mango = 'false';
         if($scope.grocery.bogo){
             bogo = 'true';
         }
         if($scope.grocery.homedelivery){
             homeDelivery = 'true';
         }
         if($scope.grocery.discount > 0){
             discount = $scope.grocery.discount;
         }
         if($scope.grocery.tomoto){
             tomoto = 'true';
         }
         if($scope.grocery.onion){
             onion = 'true';
         }
         if($scope.grocery.mango){
             mango = 'true';
         }
         db.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS GROCERY (bogo, homeDelivery, discount, tomoto, onion, mango)');
             tx.executeSql('SELECT * FROM GROCERY',[], function(tx, result){
                if(result.rows.length == 0){
                    tx.executeSql('INSERT INTO GROCERY (bogo, homeDelivery, discount, tomoto, onion, mango) VALUES (?, ?, ?, ?, ?, ?)',[bogo, homeDelivery, discount, tomoto, onion, mango]);
                }else{
                    tx.executeSql('UPDATE GROCERY SET bogo=?, homeDelivery=?, discount=?, tomoto=?, onion=?, mango=?',[bogo, homeDelivery, discount, tomoto, onion, mango], function(tx,re){
                        tx.executeSql('SELECT * FROM GROCERY',[], function(tx, resu){

                        },errorCB);
                    },errorCB);
                }
            },errorCB);
        }, errorCB, successCB);

         // food

         var bogoFood ='false', homeDeliveryFood ='false', discountFood =30, lunch = 'false',snacks = 'false',dinner = 'false';
         if($scope.food.bogo){
             bogoFood = 'true';
         }
         if($scope.food.homedelivery){
             homeDeliveryFood = 'true';
         }
         if($scope.food.discount > 0){
             discountFood = $scope.food.discount;
         }
         if($scope.food.lunch){
             lunch = 'true';
         }
         if($scope.food.dinner){
             dinner = 'true';
         }
         if($scope.food.snacks){
             snacks = 'true';
         }
         db.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS FOOD (bogo, homeDelivery, discount, lunch, dinner, snacks)');
             tx.executeSql('SELECT * FROM FOOD',[], function(tx, result){
                if(result.rows.length == 0){
                    tx.executeSql('INSERT INTO FOOD (bogo, homeDelivery, discount, lunch, dinner, snacks) VALUES (?, ?, ?, ?, ?, ?)',[bogoFood, homeDeliveryFood, discountFood, lunch, dinner, snacks]);
                }else{
                    tx.executeSql('UPDATE FOOD SET bogo=?, homeDelivery=?, discount=?, lunch=?, dinner=?, snacks=?',[bogoFood, homeDeliveryFood, discountFood, lunch, dinner, snacks], function(tx,re){

                        tx.executeSql('SELECT * FROM FOOD',[], function(tx, resu){
                            updateRecommendedOfferData();
                            activate_page("#homepage"); 
                        },errorCB);
                    },errorCB);
                }
            },errorCB);
        }, errorCB, function(){

         });
     }
     $scope.back = function(){
         activate_page("#homepage"); 
     }
     $scope.groceryShow=false;
     $scope.groceryClick = function(){
         if($scope.groceryShow)
             $scope.groceryShow = false;
         else
             $scope.groceryShow = true;
     }
     $scope.customShow=false;
     $scope.customClick = function(){
         if($scope.customShow)
             $scope.customShow = false;
         else
             $scope.customShow = true;
     }
    $scope.onLoad = function() {
        document.addEventListener('deviceready', initApp, false);  
    }
    $ionicPlatform.registerBackButtonAction(function () {
        activate_page("#homepage");
    },100);

    var interceptEnabled = false;
    function initApp() {
        
        db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
        db.transaction(populateDB, errorCB, successCB);
        db.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS FOOD (bogo, homeDelivery, discount, lunch, dinner, snacks)');
             tx.executeSql('SELECT * FROM FOOD',[], function(tx, result){
                if(result.rows.length != 0){
                    console.log(result.rows);
                    $scope.food.homedelivery = (result.rows[0].homeDelivery === 'true');
                    $scope.food.bogo = (result.rows[0].bogo === 'true');
                    $scope.food.discount = parseInt(result.rows[0].discount);
                    $scope.food.lunch = (result.rows[0].lunch === 'true');
                    $scope.food.dinner = (result.rows[0].dinner === 'true');
                    $scope.food.snacks = (result.rows[0].snacks === 'true');
                    $scope.$apply();
                }
            },errorCB);
        }, errorCB, successCB);
        db.transaction(function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS GROCERY (bogo, homeDelivery, discount, tomoto, onion, mango)');
             tx.executeSql('SELECT * FROM GROCERY',[], function(tx, result){
                if(result.rows.length != 0){
                    console.log(result.rows);
                    $scope.grocery.homedelivery = (result.rows[0].homeDelivery === 'true');
                    $scope.grocery.bogo = (result.rows[0].bogo === 'true');
                    $scope.grocery.discount = parseInt(result.rows[0].discount);
                    $scope.grocery.tomoto = (result.rows[0].tomoto === 'true');
                    $scope.grocery.onion = (result.rows[0].onion === 'true');
                    $scope.grocery.mango = (result.rows[0].mango === 'true');
                    $scope.$apply();
                }
            },errorCB);
        }, errorCB, successCB);
        db.transaction(function(tx){
                tx.executeSql('CREATE TABLE IF NOT EXISTS CUSTOMTEXT (text)');
                 tx.executeSql('SELECT * FROM CUSTOMTEXT',[], function(tx, result){
                    if(result.rows.length != 0){
                        $scope.customText = result.rows[0].text;
                        $scope.$apply();
                    }
                },errorCB);
            }, errorCB, successCB);

        if (! SMS ) { alert( 'SMS plugin not ready' ); return; }
        if(SMS) SMS.startWatch(function(){
            //update('watching', 'watching started');
        }, function(){
            //updateStatus('failed to start watching');
        });
        if(SMS) SMS.enableIntercept(true, function(){}, function(){});
        document.addEventListener('onSMSArrive', function(e){
            var data = e.data;
            console.log(data);
            if(data.address == "+919902908472"){
                var category;
                var subcategory;
                if(data.address == "+919902908472"){
                    category = 'Food';
                    subcategory = 'Snacks';
                }
                var provider = data.address;
                var message = data.body;
                var timestamp = new Date(data.date);
                var year = timestamp.getFullYear()+"";
                var month = (timestamp.getMonth()+1)+"";
                var day = timestamp.getDate()+"";
                var dateFormat = year + "-" + month + "-" + day;
                var hours = timestamp.getHours()+"";
                var minutes = (timestamp.getMinutes())+"";
                var secons = timestamp.getSeconds()+"";
                var time = hours + ":" + minutes + ":" + secons;
                timestamp = dateFormat + " " + time;
                db.transaction(function(tx){
                    saveInitialDataNew(message, tx, provider, category, subcategory, timestamp);
                    updateLatestOfferData(tx);                    
                }, errorCB, successCB);
                console.log(data);

            }

        });       
    }

    function isInt(value) {
      return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }

    function populateDB(tx) {

//        tx.executeSql('DROP TABLE IF EXISTS OFFERS');
//        tx.executeSql('DROP TABLE IF EXISTS UTILS');
        tx.executeSql('CREATE TABLE IF NOT EXISTS UTILS (flag)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS OFFERS (id integer primary key autoincrement, provider, message, timestamp, category, subcategory, discount, homedelivery, bogo, price)');
        tx.executeSql('SELECT * FROM UTILS',[],function(tx,result){
            console.log(result);
            if(result.rows.length == 0){
                tx.executeSql('INSERT INTO UTILS (flag) VALUES (?)', ["done"]);
                var message = "It's Friday the 13th, with Chai Point. Use code FRIDAY13 to get 13% off on all online & App orders today. Order on bit.ly/GetChai or http://in.upipr.co/fun20. T&C apply.";
                var provider = "DZ-CHAIPT";
                var category = "Food";
                var subcategory ="Snacks";
                var timestamp = "2016-05-14 11:00:00";
                saveInitialData(message, tx, provider, category, subcategory, timestamp);

                message = "PERFECT MORNING CHAI + HEALTHY BREAKFAST = GREAT DAY! Download the Chai Point app at http://upipr.co/chaipoint or order online at bit.ly/GetChai. Apply CHAI10 and get a 10% off on all app and online orders. T&C apply.";
                provider = "DZ-CHAIPT";
                category = "Food";
                subcategory ="Snacks";
                timestamp = "2016-05-13 11:00:00";
                saveInitialData(message, tx, provider, category, subcategory, timestamp);

                message = "It's Fun Friday with Chai Point. Use code FUN20 to get 20% off on all online & App orders today. Order on bit.ly/GetChai or http://in.upipr.co/fun20. T&C apply.";
                provider = "DZ-CHAIPT";
                category = "Food";
                subcategory ="Snacks";
                timestamp = "2016-05-12 11:00:00";
                saveInitialData(message, tx, provider, category, subcategory, timestamp);

                message = "Summer Savers at RELIANCE MARKET, Shantinagar. 100 % Cotton Double Bedsheet Rs.299 ! BUY 1.2 L Mango Sip & GET Rs.34 OFF on MRP ! Valid till 15th May ! T&C";
                provider = "IM-RELMKT";
                category = "Grocery";
                subcategory ="Vegitables";
                timestamp = "2016-05-12 11:00:00";
                saveInitialData(message, tx, provider, category, subcategory, timestamp);

                message = "Weekend Price Drop at RELIANCE MARKET, Shantinagar. 1 kg Onion Rs.14 Only ! 25 kg Daily Delight Steam Rice Rs.875 Only!Valid till 17th Apr!T&C";
                provider = "IM-RELMKT";
                category = "Grocery";
                subcategory ="Vegitables";
                timestamp = "2016-05-14 11:00:00";
                saveInitialData(message, tx, provider, category, subcategory, timestamp);
            }
        },errorCB);
        updateLatestOfferData(tx);
        updateRecommendedOfferData();
    }

    function updateLatestOfferData(tx){
        tx.executeSql('SELECT * FROM OFFERS ORDER BY timestamp desc LIMIT 5', [], querySuccess, errorCB);
    }

    function updateRecommendedOfferData(){
        $scope.recommendationList = [];
        var allMessages, customText, grocery, food,messagestoPush;
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM OFFERS ORDER BY timestamp desc', [], function(tx, result){
                allMessages = result.rows;
                console.log(allMessages);
                tx.executeSql('SELECT * FROM CUSTOMTEXT',[], function(tx, result){
                    if(result.rows.length != 0){
                        customText = result.rows[0].text;
                    }
                    tx.executeSql('SELECT * FROM GROCERY',[], function(tx, res){
                        if(res.rows.length != 0){
                            grocery = res.rows[0];
                        }
                        tx.executeSql('SELECT * FROM FOOD',[], function(tx, resu){
                            if(resu.rows.length != 0){
                                food = resu.rows[0];
                            }


                            for(var i=0;i<allMessages.length;i++)
                                {
                                    if(allMessages[i].message.toLowerCase().indexOf(customText.toLowerCase()) >-1)
                                        {
                                            var temp = {};
                                                temp.bogo = allMessages[i].bogo;
                                                temp.provider = allMessages[i].provider;
                                                temp.message = allMessages[i].message;
                                                temp.price = allMessages[i].price;
                                                temp.discount = allMessages[i].discount;
                                                temp.category = allMessages[i].category;
                                                temp.subcategory = allMessages[i].subcategory;
                                                temp.homedelivery = allMessages[i].homedelivery;
                                                if(temp.homedelivery == 'true')
                                                    temp.homedelivery = 'Yes';
                                                else
                                                    temp.homedelivery = 'NA';
                                                if(temp.bogo == 'true')
                                                    temp.bogo = 'Yes';
                                                else
                                                    temp.bogo = 'No';
                                                temp.timestamp = allMessages[i].timestamp;
                                                if(temp.provider == "DZ-CHAIPT"){
                                                    temp.icon = "chai.png";
                                                }else if(temp.provider == "IM-RELMKT"){
                                                    temp.icon = "reliance.png";
                                                }else if(temp.provider == "+919902908472"){
                                                    temp.icon = "dominos.png";
                                                }


                                                 $scope.recommendationList.push(temp);

                                        }
                                    else if(allMessages[i].category.toLowerCase()=='food'){
                                        if(allMessages[i].bogo==food.bogo||allMessages[i].homeDelivery==food.homeDelivery||parseInt(allMessages[i].discount)>=parseInt(food.discount)|| (allMessages[i].subcategory.toLowerCase()=='lunch'&& food.lunch=='true')||(allMessages[i].subcategory.toLowerCase()=='snacks'&& food.snacks=='true')||
                                        (allMessages[i].subcategory.toLowerCase()=='dinner'&& food.dinner=='true'))
                                            {
                                                var temp = {};
                                                temp.bogo = allMessages[i].bogo;
                                                temp.provider = allMessages[i].provider;
                                                temp.message = allMessages[i].message;
                                                temp.price = allMessages[i].price;
                                                temp.discount = allMessages[i].discount;
                                                temp.category = allMessages[i].category;
                                                temp.subcategory = allMessages[i].subcategory;
                                                temp.homedelivery = allMessages[i].homedelivery;
                                                if(temp.homedelivery == 'true')
                                                    temp.homedelivery = 'Yes';
                                                else
                                                    temp.homedelivery = 'NA';
                                                if(temp.bogo == 'true')
                                                    temp.bogo = 'Yes';
                                                else
                                                    temp.bogo = 'No';
                                                temp.timestamp = allMessages[i].timestamp;
                                                if(temp.provider == "DZ-CHAIPT"){
                                                    temp.icon = "chai.png";
                                                }else if(temp.provider == "IM-RELMKT"){
                                                    temp.icon = "reliance.png";
                                                }else if(temp.provider == "+919902908472"){
                                                    temp.icon = "dominos.png";
                                                }


                                                 $scope.recommendationList.push(temp);
                                            }

                                    }
                                     else if(allMessages[i].category.toLowerCase()=='grocery'){
                                        if(allMessages[i].bogo==grocery.bogo||allMessages[i].homeDelivery==grocery.homeDelivery||parseInt(allMessages[i].discount)>=parseInt(grocery.discount)|| (allMessages[i].message.toLowerCase().indexOf('tomoto')>-1&& grocery.tomoto=='true')||(allMessages[i].message.toLowerCase().indexOf('mango')>-1&& grocery.mango=='true')||
                                        (allMessages[i].message.toLowerCase().indexOf('onion')>-1&& grocery.onion=='true'))
                                            {
                                                var temp = {};
                                                temp.bogo = allMessages[i].bogo;
                                                temp.provider = allMessages[i].provider;
                                                temp.message = allMessages[i].message;
                                                temp.price = allMessages[i].price;
                                                temp.discount = allMessages[i].discount;
                                                temp.category = allMessages[i].category;
                                                temp.subcategory = allMessages[i].subcategory;
                                                temp.homedelivery = allMessages[i].homedelivery;
                                                if(temp.homedelivery == 'true')
                                                    temp.homedelivery = 'Yes';
                                                else
                                                    temp.homedelivery = 'NA';
                                                if(temp.bogo == 'true')
                                                    temp.bogo = 'Yes';
                                                else
                                                    temp.bogo = 'No';
                                                temp.timestamp = allMessages[i].timestamp;
                                                if(temp.provider == "DZ-CHAIPT"){
                                                    temp.icon = "chai.png";
                                                }else if(temp.provider == "IM-RELMKT"){
                                                    temp.icon = "reliance.png";
                                                }else if(temp.provider == "+919902908472"){
                                                    temp.icon = "dominos.png";
                                                }


                                                 $scope.recommendationList.push(temp);
                                            }

                                    }




                                }
                            $scope.$apply();


                        },errorCB);
                    },errorCB);
                },errorCB);
            }, errorCB);
        }, errorCB, successCB);
    }

    function saveInitialData(message, tx, provider, category, subcategory, timestamp){
        var index = message.replace(/ +/g, "").indexOf("%off");
        if(index > -1){
            var discount = message.replace(/ +/g, "").substr(index-2,2);
            if (!isInt(discount))
                discount = message.replace(/ +/g, "").substr(index-1,1);
        }else{
            var discount = "NA";
        }

        var homedelivery = message.replace(/ +/g, "").toLowerCase().indexOf("homedelivery");
        if(homedelivery > -1){
            homedelivery = "true";
        }else{
            homedelivery = "false";
        }
        var bogo = message.replace(/ +/g, "").toLowerCase().indexOf("bogo");
        if(bogo > -1){
            bogo = "true";
        }else{
            bogo = "false";
        }
        var priceIndex =  message.replace(/ +/g, "").toLowerCase().indexOf("rs.");
        if(priceIndex > -1){
            var i=1;
            var price = message.replace(/ +/g, "").substr(priceIndex+3,i);
            while(isInt(price)){
                price = message.replace(/ +/g, "").substr(priceIndex+3,++i);
            }
            price = message.replace(/ +/g, "").substr(priceIndex+3,i-1);
        }else{
            var price="NA";
        }
        tx.executeSql('INSERT INTO OFFERS (message, provider, timestamp, category, subcategory, discount, homedelivery, bogo, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',[message, provider, timestamp, category, subcategory, discount, homedelivery, bogo, price]);
    }
     function querySuccess(tx, results) { 
        $scope.dbOfferData = [];
        for(index in results.rows){
            var temp = {};
            temp.bogo = results.rows[index].bogo;
            temp.provider = results.rows[index].provider;
            temp.message = results.rows[index].message;
            temp.price = results.rows[index].price;
            temp.discount = results.rows[index].discount;
            temp.category = results.rows[index].category;
            temp.subcategory = results.rows[index].subcategory;
            temp.homedelivery = results.rows[index].homedelivery;
            if(temp.homedelivery == 'true')
                temp.homedelivery = 'Yes';
            else
                temp.homedelivery = 'NA';
            if(temp.bogo == 'true')
                temp.bogo = 'Yes';
            else
                temp.bogo = 'No';
            temp.timestamp = results.rows[index].timestamp;
            if(temp.provider == "DZ-CHAIPT"){
                temp.icon = "chai.png";
            }else if(temp.provider == "IM-RELMKT"){
                temp.icon = "reliance.png";
            }else if(temp.provider == "+919902908472"){
                temp.icon = "dominos.png";
            }
            if(temp.message != undefined){
                $scope.dbOfferData.push(temp);
            }

        }
        $scope.$apply(); 

    }

    function errorCB(err) {
        console.log(err);
    }

    function successCB() {
        console.log('Success');
    }


    function saveInitialDataNew(message, tx, provider, category, subcategory, timestamp){
        var index = message.replace(/ +/g, "").indexOf("%off");
        if(index > -1){
            var discount = message.replace(/ +/g, "").substr(index-2,2);
            if (!isInt(discount))
                discount = message.replace(/ +/g, "").substr(index-1,1);
        }else{
            var discount = "NA";
        }

        var homedelivery = message.replace(/ +/g, "").toLowerCase().indexOf("homedelivery");
        if(homedelivery > -1){
            homedelivery = "true";
        }else{
            homedelivery = "false";
        }
        var bogo = message.replace(/ +/g, "").toLowerCase().indexOf("bogo");
        if(bogo > -1){
            bogo = "true";
        }else{
            bogo = "false";
        }
        var priceIndex =  message.replace(/ +/g, "").toLowerCase().indexOf("rs.");
        if(priceIndex > -1){
            var i=1;
            var price = message.replace(/ +/g, "").substr(priceIndex+3,i);
            while(isInt(price)){
                price = message.replace(/ +/g, "").substr(priceIndex+3,++i);
            }
            price = message.replace(/ +/g, "").substr(priceIndex+3,i-1);
        }else{
            var price="NA";
        }
        tx.executeSql('INSERT INTO OFFERS (message, provider, timestamp, category, subcategory, discount, homedelivery, bogo, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',[message, provider, timestamp, category, subcategory, discount, homedelivery, bogo, price]);

         var customText, grocery, food,messagestoPush;
        tx.executeSql('SELECT * FROM CUSTOMTEXT',[], function(tx, result){
        if(result.rows.length != 0){
            customText = result.rows[0].text;
        }
        tx.executeSql('SELECT * FROM GROCERY',[], function(tx, res){
            if(res.rows.length != 0){
                grocery = res.rows[0];
            }
            tx.executeSql('SELECT * FROM FOOD',[], function(tx, resu){
                if(resu.rows.length != 0){
                    food = resu.rows[0];
                }                                    if(message.toLowerCase().indexOf(customText.toLowerCase()) >-1)
                {
                    var temp = {};
                    temp.bogo = bogo;
                    temp.provider = provider;
                    temp.message = message;
                    temp.price = price;
                    temp.discount = discount;
                    temp.category = category;
                    temp.subcategory = subcategory;
                    temp.homedelivery = homedelivery;
                    if(temp.homedelivery == 'true')
                        temp.homedelivery = 'Yes';
                    else
                        temp.homedelivery = 'NA';
                    if(temp.bogo == 'true')
                        temp.bogo = 'Yes';
                    else
                        temp.bogo = 'No';
                    temp.timestamp = timestamp;
                    if(temp.provider == "DZ-CHAIPT"){
                        temp.icon = "chai.png";
                    }else if(temp.provider == "IM-RELMKT"){
                        temp.icon = "reliance.png";
                    }else if(temp.provider == "+919902908472"){
                        temp.icon = "dominos.png";
                    }

                     $scope.recommendationList.unshift(temp);
                    cordova.plugins.notification.local.schedule({
                        id: 10,
                        title: "Offer you are looking for!!",
                        text: message,
                        data: { meetingId:"#123FG8" }
                    });

                }
                else if(category.toLowerCase()=='food'){
                    if(bogo==food.bogo||homeDelivery==food.homeDelivery||parseInt(discount)>=parseInt(food.discount)|| (subcategory.toLowerCase()=='lunch'&& food.lunch=='true')||(subcategory.toLowerCase()=='snacks'&& food.snacks=='true')||
                    (subcategory.toLowerCase()=='dinner'&& food.dinner=='true'))
                        {
                            var temp = {};
                            temp.bogo = bogo;
                            temp.provider = provider;
                            temp.message = message;
                            temp.price = price;
                            temp.discount = discount;
                            temp.category = category;
                            temp.subcategory = subcategory;
                            temp.homedelivery = homedelivery;
                            if(temp.homedelivery == 'true')
                                temp.homedelivery = 'Yes';
                            else
                                temp.homedelivery = 'NA';
                            if(temp.bogo == 'true')
                                temp.bogo = 'Yes';
                            else
                                temp.bogo = 'No';
                            temp.timestamp = timestamp;
                            if(temp.provider == "DZ-CHAIPT"){
                                temp.icon = "chai.png";
                            }else if(temp.provider == "IM-RELMKT"){
                                temp.icon = "reliance.png";
                            }else if(temp.provider == "+919902908472"){
                                temp.icon = "dominos.png";
                            }

                             $scope.recommendationList.unshift(temp);
                            cordova.plugins.notification.local.schedule({
                                id: 10,
                                title: "Offer you are looking for!!",
                                text: message,
                                data: { meetingId:"#123FG8" }
                            });
                        }

                }
                 else if(category.toLowerCase()=='grocery'){
                    if(bogo==grocery.bogo||homeDelivery==grocery.homeDelivery||parseInt(discount)>=parseInt(grocery.discount)|| (message.toLowerCase().indexOf('tomoto')>-1&& grocery.tomoto=='true')||(message.toLowerCase().indexOf('mango')>-1&& grocery.mango=='true')||
                    (message.toLowerCase().indexOf('onion')>-1&& grocery.onion=='true'))
                        {
                            var temp = {};
                            temp.bogo = bogo;
                            temp.provider = provider;
                            temp.message = message;
                            temp.price = price;
                            temp.discount = discount;
                            temp.category = category;
                            temp.subcategory = subcategory;
                            temp.homedelivery = homedelivery;
                            if(temp.homedelivery == 'true')
                                temp.homedelivery = 'Yes';
                            else
                                temp.homedelivery = 'NA';
                            if(temp.bogo == 'true')
                                temp.bogo = 'Yes';
                            else
                                temp.bogo = 'No';
                            temp.timestamp = timestamp;
                            if(temp.provider == "DZ-CHAIPT"){
                                temp.icon = "chai.png";
                            }else if(temp.provider == "IM-RELMKT"){
                                temp.icon = "reliance.png";
                            }else if(temp.provider == "+919902908472"){
                                temp.icon = "dominos.png";
                            }

                             $scope.recommendationList.unshift(temp);
                            cordova.plugins.notification.local.schedule({
                                id: 10,
                                title: "Offer you are looking for!!",
                                text: message,
                                data: { meetingId:"#123FG8" }
                            });
                        }

                }
                $scope.$apply();  
            },errorCB);
        },errorCB);
        },errorCB);
    }

    $scope.onLoad();    


});
