import { OrderService } from "./services/order.service";


var queryParams = process.argv[2];

console.log("INPUT:",queryParams);

let res = OrderService.parseInput(queryParams);
console.log("OUTPUT:"+res);

// let nationality = orderService.checkNationality('B123AB1234567');
// console.log("Nationality:",nationality)

