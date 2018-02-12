$(function(){
    $(".form-control").on("change paste keyup", function() {
        calculateBang4Buck(); 
     });
});

let calculateBang4Buck = function() {
    let drink1 = { "volume" : $("#drinkVolume1").val(),
                   "alcohol" : $("#drinkAlcohol1").val(),
                   "price" : $("#drinkPrice1").val() };

    let drink2 = { "volume" : $("#drinkVolume2").val(),
                   "alcohol" : $("#drinkAlcohol2").val(),
                   "price" : $("#drinkPrice2").val() };

    if(drink1.volume != "" && drink1.alcohol != "" && drink1.price != "" && drink2.volume != "" && drink2.alcohol != "" && drink2.price != "") {
        let drink1Value = drink1.volume * drink1.alcohol / drink1.price;
        let drink2Value = drink2.volume * drink2.alcohol / drink2.price;

        if(drink1Value > drink2Value) {
            $("#drinkTitle1").css("color","#60992D");
            $("#drinkTitle2").css("color","ivory");
            console.log("Drink 1: " + drink1Value);
            console.log("Drink 2: " + drink2Value);
        } else if(drink1Value < drink2Value){
            $("#drinkTitle1").css("color","ivory");
            $("#drinkTitle2").css("color","#60992D");
            console.log("Drink 1: " + drink1Value);
            console.log("Drink 2: " + drink2Value);
        } else {
            $("#drinkTitle1").css("color","#60992D");
            $("#drinkTitle2").css("color","#60992D");
            console.log("Drink 1: " + drink1Value);
            console.log("Drink 2: " + drink2Value);
        }
    }
    else
    {
        $("#drinkTitle1").css("color","ivory");
        $("#drinkTitle2").css("color","ivory");
    }
};