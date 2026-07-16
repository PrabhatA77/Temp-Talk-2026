//char used to generate a short random room ID
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export const generateRoomId = (length=6) =>{
    let result = "";
    for(let i=0;i<length;i++){
        result += CHARACTERS.charAt(Math.floor(Math.random()*CHARACTERS.length));
    }
    return result;
}