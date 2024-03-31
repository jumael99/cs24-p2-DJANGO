# Ecosync

## Team Name: DJANGO

Ecosync is a web application designed to optimize waste management and logistics. Our innovative approach simplifies the calculation of logistics and cost management by utilizing a fleet of four different types of trucks, tailored to the needs of Solid Waste Transfer Stations (STS).

### Calculation Simplification

In our logistics model, every STS has access to four different types of trucks. The decision on which truck to deploy is based on the amount of waste to be transported:

- For the initial trips, if there is sufficient waste, all types of trucks will be deployed.
- On the final trip:
    - If the remaining waste is less than 3 tons, only an Open Truck is deployed.
    - If the waste is less than 5 tons, a Dump Truck will be used.
    - If the waste is less than 15 tons, a Container Carrier is chosen.
    - Otherwise, a Compactor Truck will be deployed for any waste amount over 15 tons.

This optimization ensures the most efficient and cost-effective transportation of waste, while also calculating the fuel costs for the total distance traveled in kilometers.

### Truck Fleet Details

Below is the code representation of our truck fleet, including each truck's capacity, the maximum number of trips it can make, and the cost of operation (loaded and unloaded) in dollars.

```javascript
const trucks = [
    { type: 'Compactor Truck', capacity: 35, trips: 0, maxTrips: 3, unloaded: '$7.0', loaded: '$8.0'},
    { type: 'Container Carrier', capacity: 15, trips: 0, maxTrips: 3, unloaded: '$8.0', loaded: '$10.0'},
    { type: 'Dump Truck', capacity: 5, trips: 0, maxTrips: 3, unloaded: '$6.0', loaded: '$7.0'},
    { type: 'Open Truck', capacity: 3, trips: 0, maxTrips: 3, unloaded: '$4.0', loaded: '$5.0'}
];
```

### Credentials

`admin`  
Username: admin  
Password: admin  

`STS maanger`  
Username: sultan99@gmail.com  
Password: 11111  

`Landfill manaager`  
Username: ib@gmail.com    
Password: 11111  


