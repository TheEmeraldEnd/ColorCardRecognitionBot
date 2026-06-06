//[min, max)
export function GetRandomInt(min = 0, max = 1){
    //corrections
    if (min > max){
        let temp = max;
        max = min;
        min = temp;
    }

    if(min === max){
        return min;
    }

    return Math.floor(Math.random(Date.now()) * (max - min) + min)
}