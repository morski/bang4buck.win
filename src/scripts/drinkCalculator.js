$(function(){
    $("input").on("change paste keyup", () => {
        calculateBang4Buck(); 
     });
     $("select").on("change paste keyup", () => {
        calculateBang4Buck(); 
     });
});

let calculateBang4Buck = () => {
    let drink1 = getDrink(1);
    let drink2 = getDrink(2);

    if(drink1.volume != "" && drink1.alcohol != "" && drink1.price != "" && drink2.volume != "" && drink2.alcohol != "" && drink2.price != "") {
        let drink1Value = calculateDrinkabilityScore(drink1);
        let drink2Value = calculateDrinkabilityScore(drink2);

        if(drink1Value > drink2Value) {
            $("#1").addClass("winner");
            $("#2").removeClass("winner");
        } else if(drink1Value < drink2Value){
            $("#2").addClass("winner");
            $("#1").removeClass("winner");
        } else {
            $("#1").addClass("winner");
            $("#2").addClass("winner");
        }
        console.log("Drink 1: " + drink1Value);
        console.log("Drink 2: " + drink2Value);
    }
    else
    {
        $("#1").removeClass("winner");
        $("#2").removeClass("winner");
    }
};

const calculateDrinkabilityScore = (drink) => {
    return drink.volume * drink.alcohol / drink.price;
} 

const getDrink = (drinkNumber) => {
    return {
        volume: $(`#${drinkNumber} .volume input`).val(),
        alcohol: $(`#${drinkNumber} .alcohol input`).val(),
        price: $(`#${drinkNumber} .price input`).val()
    };
}