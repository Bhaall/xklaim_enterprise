{
    "meta": {
        "message": {
            "subtitle": "",
            "title": "success"
        },
        "code": 200
    },
    "response": {
        "email_id": "ankur@paidpiper.com",
        "first_name": "ankit",
        "last_name": "sharmaji",
        "accounts": [{
            "offer_count": {
                "archived": 0,
                "completed": 1,
                "running": 4,
                "draft": 3,
                "approved": 4,
                "pending": 1
            },
            "balance": 245.0,
            "payment_info": [{
			"payment_id": "3abb24b08b5b4166be22f5c0f07c0873",
			"city": "Burlingame",
			"first_name": "Lester",
			"last_name": "Tester",
			"payment_method_type": "CR",
			"cvv": "123",
			"authority": "Visa",
			"expiry": "0616",
			"is_default": false,
			"balance": 100.0,
			"state": "CA",
			"address": "1325 Howard Ave., Ste. 258",
			"zip_code": "94010",
			"card_number": "XXXXXXXXXXXX5454",
			"payment_method_name": "MyVisa",
			"checked":false
            },
		{
			"payment_id": "1234-2",
			"payment_method_name": "Company MDF account",
			"payment_method_type": "CH",
			"routing_number":"AA23423434",
			"account_number":"246312434",
			"is_default": false,
			"balance": 45.0,
			"first_name": "Lester",
			"last_name": "Tester",
			"address": "15990 S. 2nd W. STE 250", 
			"city": "West Yellowstone",
			"state": "MT",
			"zip_code": "94549-1234",
			"checked":false
		},      
            {
			"payment_id": "8619125cc9fb4c30952e7116f7e0f95b",
			"city": "Lexington",
			"first_name": "Lester",
			"last_name": "Tester",
			"payment_method_type": "CR",
			"cvv": "123",
			"authority": "MasterCard",
			"expiry": "0415",
			"is_default": false,
			"balance": 100.0,
			"state": "KY",
			"address": "5000 5th av",
			"zip_code": "50505",
			"card_number": "XXXXXXXXXXXX1212",
			"payment_method_name": "MyMC",
			"checked":false
            },
            { 
			"payment_id": "a309dd30e8274548a20dc8ca26e1d523",
			"city": null,
			"first_name": "",
			"last_name": "",
			"payment_method_type": "CP",
			"authority": null,
			"expiry": null,
			"is_default": false,
			"state": null,
			"address": null,
			"balance": 0,
			"zip_code": null,
			"card_number": null,
			"payment_method_name": "MyPayPal"
		}],
            "history": [
            	{
			    "has_modal": true,
			    "name": "Lee Moberly",
			    "ts": "2014-04-21T16:30:10Z",
			    "id": 603,
			    "modal_vals": [{
				  "filter": "",
				  "curr_value": "MyMC",
				  "format": "",
				  "field_name": "name",
				  "prev_value": ""
			    }],
			    "event": "added MyMC"
            	}, {
			    "has_modal": true,
			    "name": "Lee Moberly",
			    "ts": "2014-04-21T16:30:10Z",
			    "id": 602,
			    "modal_vals": [{
				  "filter": "",
				  "curr_value": "MyVisa",
				  "format": "",
				  "field_name": "name",
				  "prev_value": "MyVisa2"
			    }],
			    "event": "added MyVisa"            	
            	}, {
			    "has_modal": true,
			    "name": "Lee Moberly",
			    "ts": "2014-04-21T16:30:10Z",
			    "id": 601,
			    "modal_vals": [{
				  "filter": "",
				  "curr_value": "MyPayPal",
				  "format": "",
				  "field_name": "name",
				  "prev_value": ""
			    }],
			    "event": "added MyPayPal"
            	}, {
			    "has_modal": true,
			    "name": "Lee Moberly",
			    "ts": "2014-04-21T16:30:10Z",
			    "id": 599,
			    "modal_vals": [{
				  "filter": "",
				  "curr_value": "Company MDF account",
				  "format": "",
				  "field_name": "name",
				  "prev_value": ""
			    }],
			    "event": "added Company MDF account"
            	}
            ],
		"transaction_history": [{
                "created_ts": "2014-07-13T11:34:37-07:00",
                "description": "Transfer in",
                "offer_id": 51,
                "amount": 20.0,
                "date": "2014-07-13",
                "offer_name": "Standard Test One",
                "payment_method_id": "3abb24b08b5b4166be22f5c0f07c0873",
                "payment_method_name": "MyVisa"
            }, {
                "created_ts": "2014-07-31T00:01:00-07:00",
                "description": "Transfer in",
                "offer_id": 1242,
                "amount": 5.0,
                "date": "2014-07-31",
                "offer_name": "Twitter Standard 2",
                "payment_method_id": "a309dd30e8274548a20dc8ca26e1d523",
                "payment_method_name": "MyPayPal"
            }, {
                "created_ts": "2014-07-29T00:01:08-07:00",
                "description": "Transfer in",
                "offer_id": 52,
                "amount": 20.0,
                "date": "2014-07-29",
                "offer_name": "Sku Test 52",
                "payment_method_id": "1234-2",
                "payment_method_name": "Company MDF account"
            }, {
                "created_ts": "2014-07-18T11:33:50-07:00",
                "description": "Transfer in",
                "offer_id": 1134,
                "amount": 20.0,
                "date": "2014-07-18",
                "offer_name": "Bundle Test One",
                "payment_method_id": "3abb24b08b5b4166be22f5c0f07c0873",
                "payment_method_name": "MyVisa"
            }, {
                "created_ts": "2014-07-12T00:00:58-07:00",
                "description": "Transfer in",
                "offer_id": 50,
                "amount": 4.0,
                "date": "2014-07-12",
                "offer_name": "Sku Test One",
                "payment_method_id": "1234-2",
                "payment_method_name": "Company MDF account"
            }, {
                "created_ts": "2014-05-29T13:48:49-07:00",
                "description": "Transfer in",
                "offer_id": 47,
                "amount": 5.0,
                "date": "2014-05-29",
                "offer_name": "Direct: Multiple",
                "payment_method_id": "3abb24b08b5b4166be22f5c0f07c0873",
                "payment_method_name": "MyVisa"
            }, {
                "created_ts": "2014-05-15T13:32:57-07:00",
                "description": "Transfer out",
                "offer_id": 48,
                "amount": 10.0,
                "date": "2014-05-15",
                "offer_name": "Direct: Multiple",
                "payment_method_id": "3abb24b08b5b4166be22f5c0f07c0873",
                "payment_method_name": "MyVisa"
            }, {
                "created_ts": "2014-05-15T13:32:57-07:00",
                "description": "Transfer in",
                "offer_id": 473,
                "amount": 10.0,
                "date": "2014-05-15",
                "offer_name": "First One",
                "payment_method_id": "8619125cc9fb4c30952e7116f7e0f95b",
                "payment_method_name": "MyMC"
            }, {
                "created_ts": "2014-05-21T13:32:57-07:00",
                "description": "Transfer out",
                "offer_id": 485,
                "amount": 20.0,
                "date": "2014-05-21",
                "offer_name": "Direct: Susan Atkins",
                "payment_method_id": "8619125cc9fb4c30952e7116f7e0f95b",
                "payment_method_name": "MyMC"
            }, {
                "created_ts": "2014-05-21T13:32:57-07:00",
                "description": "Transfer out",
                "offer_id": 49,
                "amount": 5.0,
                "date": "2014-05-21",
                "offer_name": "Offer 49",
                "payment_method_id": "8619125cc9fb4c30952e7116f7e0f95b",
                "payment_method_name": "MyMC"
            }, {
                "created_ts": "2014-05-14T13:32:57-07:00",
                "description": "Transfer out",
                "offer_id": 473,
                "amount": 20.0,
                "date": "2014-05-14",
                "offer_name": "First One",
                "payment_method_id": "8619125cc9fb4c30952e7116f7e0f95b",
                "payment_method_name": "MyMC"
            }, {
                "created_ts": "2014-03-07T11:33:50-07:00",
                "description": "Transfer out",
                "offer_id": 474,
                "amount": 20.0,
                "date": "2014-03-07",
                "offer_name": "Second Test",
                "payment_method_id": "8619125cc9fb4c30952e7116f7e0f95b",
                "payment_method_name": "MyMC"
            }],
            "image_url": "http://ec2-23-23-233-144.compute-1.amazonaws.com/photos/photos/7a32a01f46a64cb6a51bd27e48ed852f",
            "is_approver_required": true,
            "account_name": "Agency of Import",
            "account_id": "006a8e1d8f0f496d8677e99a67c30df2"
        }, {
            "offer_count": {
                "archived": 0,
                "completed": 11,
                "running": 9,
                "draft": 0,
                "approved": 0,
                "pending": 0
            },
            "image_url": "http://ec2-23-23-233-144.compute-1.amazonaws.com/photos/photos/4660ef4786f2437883d851ce0cfe859c",
            "is_approver_required": false,
            "account_id": "fc13ab7e74dd4aab9b8cf3a717e36ab2",
            "account_name": "ABB Ltd"
        }]
    }
}