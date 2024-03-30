const trucks = [
    { type: 'Compactor Truck', capacity: 35, trips: 0, maxTrips: 3 , unloaded: 7.0, loaded: 8.0},
    { type: 'Container Carrier', capacity: 15, trips: 0, maxTrips: 3 , unloaded: 8.0, loaded: 10.0},
    { type: 'Dump Truck', capacity: 5, trips: 0, maxTrips: 3 , unloaded: 6.0, loaded: 7.0},
    { type: 'Open Truck', capacity: 3, trips: 0, maxTrips: 3 , unloaded: 4.0, loaded: 5.0}
];

function calculateTruckRounds(wasteAmount) {
    wasteAmount *= 1.0;
    let cost = 0, printCost = 0;
    let rounds = 0;
    let totalCapacityPerRound = trucks.reduce((sum, truck) => sum + truck.capacity, 0);

    // Full rounds where all trucks are sent
    while (wasteAmount >= totalCapacityPerRound) {
        wasteAmount -= totalCapacityPerRound;
        trucks.forEach(truck => truck.trips++);
        rounds++;
    }

    cost = rounds * 30.0;//$30 per round
    // Determine the truck to use for the remaining waste
    if (wasteAmount > 0) {
        rounds++; // Any remaining waste will require at least one more round
        if (wasteAmount <= 3) {
            trucks.find(truck => truck.type === 'Open Truck').trips++;
            if (wasteAmount === 3) cost += 5;
            else {
                cost += 4 + ((wasteAmount/trucks[3].capacity) * (trucks[3].loaded - trucks[3].unloaded))
            }
        }
        else if (wasteAmount <= 5) {
            trucks.find(truck => truck.type === 'Dump Truck').trips++;
            if (wasteAmount === 5) cost += 7;
            else {
                cost += 6 + ((wasteAmount/trucks[2].capacity) * (trucks[2].loaded - trucks[2].unloaded))
            }
        }
        else if (wasteAmount <= 15) {
            trucks.find(truck => truck.type === 'Container Carrier').trips++;
            if (wasteAmount === 15) cost += 8;
            else {
                cost += 7 + ((wasteAmount/trucks[1].capacity) * (trucks[1].loaded - trucks[1].unloaded))
            }
        }
        else {
            trucks.find(truck => truck.type === 'Compactor Truck').trips++;
            if (wasteAmount === 35) cost += 10;
            else {
                cost += 8 + ((wasteAmount/trucks[0].capacity) * (trucks[0].loaded - trucks[0].unloaded))
            }
        }
    }
    cost = cost.toFixed(2);
    // // Output
    // console.log(`Minimum Rounds Needed: ${rounds}`);
    // trucks.forEach(truck => {
    //     if (truck.trips > 0) {
    //         console.log(`${truck.type} goes ${truck.trips} times`);
    //     }
    // });
    // console.log(`final cost is: ${cost}`);
    return {rounds,cost,trucks};
}
module.exports = {calculateTruckRounds};

// calculateTruckRounds(74);  // Example 1
// calculateTruckRounds(123); // Example 2
// calculateTruckRounds(60);  // Example 3
