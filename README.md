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

	a. API Name : addCustomer
	b. API Type : Post
	c .Request Body (JSON): 
		{
			'email' : <email_address_of_customer>
		}
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": "Customer added"
		}
2. getCustomerById (For fetching a customer details by ID)
	a. API Name : getCustomerById
	b. API Type : Get
	c. Request Param : getCustomerById/<id of custumer>  eg : getCustomerById/30
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": [
		    {
		      "_id": "58578c6bd16e0506c31ce1ab",
		      "customer_id": 30,
		      "joining_date": "2016-12-19T07:29:47.994Z",
		      "last_updated": "2016-12-19T07:29:47.994Z",
		      "email": "binitcse@live.com",
		      "__v": 0,
		      "is_ambassador": false,
		      "payback": 0,
		      "referral_id": null
		    }
		  ]
		}

3. addReferral (For Adding A Referral Under A Customer)
	a. API Name : addReferral
	b. API Type : Post
	c. Request Body :
		{
			'email' : <email_address_of_customer>,
			'referral_id' : <customer_id of existing customer>
		}
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": "row updated"
		}

4. fetchAllChildren (Fetch All Children Under A Customer)
	a. API Name : fetchAllChildren
	b. API Type : Get
	c. Request Param : fetchAllChildren/<id of custumer>  eg : fetchAllChildren/30
	d. Response Body(JSON) : 
			{
	  "error": false,
	  "message": [
	    {
	      "_id": "58578e2ad16e0506c31ce1ac",
	      "customer_id": 31,
	      "joining_date": "2016-12-19T07:37:14.171Z",
	      "last_updated": "2016-12-19T07:37:14.171Z",
	      "email": "rai@live.com",
	      "__v": 0,
	      "is_ambassador": false,
	      "payback": 0,
	      "referral_id": 30
	    }
	  ],
	  "totalChilds": 1
	}
5. fetchAllCustomersWithReferralCount (Fetch all customers with the number of childrens referred by them in ascending or descending order)
	a. API Name : fetchAllCustomersWithReferralCount
	b. API Type : Get
	c. Request Param : /fetchAllCustomersWithReferralCount  eg : /fetchAllCustomersWithReferralCount
	d. Response Body(JSON) : 
	[
	  {
	    "customer_id": 22,
	    "email": "sv@jdfdii.com",
	    "totalReferal": 0
	  },
	  {
	    "customer_id": 23,
	    "email": "referalamb@jdfdii.com",
	    "totalReferal": 1
	  },
	  {
	    "customer_id": 30,
	    "email": "binitcse@live.com",
	    "totalReferal": 1
	  },
	  {
	    "customer_id": 20,
	    "email": "shiiv@jjjii.com",
	    "totalReferal": 2
	  },
	]
			
6. addAmbassador(For Adding A new ambassador)
	a. API Name : addAmbassador
	b. API Type : Post
	c. Request Body :
		{
			'email' : <email_address_of_customer>,
		}
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": "row updated"
		}
7. convertCustomerToAmbassador (A customer can be converted to an Ambassador. But will get additional 10% only on the customers added under him after the time he got converted.)
	a. API Name : convertCustomerToAmbassador
	b. API Type : Put
	c. Request Param : /convertCustomerToAmbassador/:id
	d. Request Body  : {is_ambassador : true}
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": "row updated"
		}
8. fetchAllAmbassadorChildren (Fetch All Children of an Ambassador) 
	a. API Name : fetchAllAmbassadorChildren
	b. API Type : Get
	c. Request Param : fetchAllAmbassadorChildren/<id of Ambassador>  eg : fetchAllAmbassadorChildren/23
	d. Response Body(JSON) : 
		{
		  "error": false,
		  "message": [
			
			    {
			      "_id": "5856ba15224d66027d556f21",
			      "customer_id": 24,
			      "joining_date": "2016-12-18T16:32:21.639Z",
			      "last_updated": "2016-12-18T16:32:21.639Z",
			      "email": "referalambchild@jdfdii.com",
			      "__v": 0,
			      "is_ambassador": false,
			      "payback": 0,
			      "referral_id": 23
			    }
			  ]
		}
9. fetchChildrenAtNthLEvel (Fetch all ambassador children at nth level)
	a. API Name : fetchChildrenAtNthLEvel
	b. API Type : Get
	c. Request Param : fetchChildrenAtNthLEvel/id/:id/level/:level
	d. eg : fetchChildrenAtNthLEvel/id/23/level/1
	e. Response Body(JSON) : 
		{
		  "totalChilds": 1,
		  "error": false,
		  "message": [
		    {
		      "_id": "5856ba15224d66027d556f21",
		      "customer_id": 24,
		      "joining_date": "2016-12-18T16:32:21.639Z",
		      "last_updated": "2016-12-18T16:32:21.639Z",
		      "email": "referalambchild@jdfdii.com",
		      "__v": 0,
		      "is_ambassador": false,
		      "payback": 0,
		      "referral_id": 23
		    }
		  ]
		}


## Contributors
Binit Rai
