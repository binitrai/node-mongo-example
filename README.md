## Synopsis
API design with Node.js(Express) and MongoDb
DB used : MongoDb
Framework Used : Node.js Express

## Installation

1. Start the mongo db 
		Command : mongo
2. Create new database :
   Command : use assDb

3. Start the server :
   Command : npm start

## API Reference

1. addCustomer (For Adding A new Customer)
2. getCustomerById (For fetching a customer details by ID)
3. addReferral (For Adding A Referral Under A Customer)
4. fetchAllChildren (Fetch All Children Under A Customer)	
5. fetchAllCustomersWithReferralCount (Fetch all customers with the number of childrens referred by them in ascending or descending order)		
6. addAmbassador(For Adding A new ambassador)
7. convertCustomerToAmbassador (A customer can be converted to an Ambassador. But will get additional 10% only on the customers added under him after the time he got converted.)
8. fetchAllAmbassadorChildren (Fetch All Children of an Ambassador) 	
9. fetchChildrenAtNthLEvel (Fetch all ambassador children at nth level)
	
## Contributors
Binit Rai
