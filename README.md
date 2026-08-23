# EcoSync

EcoSync is a role-based waste management and logistics platform for municipal operations. It connects administration, Solid Waste Transfer Station (STS) data entry, and landfill reporting in a single responsive application.

## Client preview

The landing page provides safe, one-click previews for the platform's three roles:

- **Admin** — account creation, user directory, and role management.
- **STS Manager** — waste load, departure, destination, and route data entry.
- **Landfill Manager** — STS lookup and downloadable A4 transport reports.

Preview sessions use sample information and never read or change live account data. Real team members can use **Team sign in** to access their assigned workspace.

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

## Development

Create a local `.env` from `.env.example`, then run:

```bash
npm install
npm run build
npm start
```

Run `npm test` to verify the precompiled views, secret configuration, and A4 PDF generator. See [DEPLOYMENT.md](./DEPLOYMENT.md) for Cloudflare Workers setup.


