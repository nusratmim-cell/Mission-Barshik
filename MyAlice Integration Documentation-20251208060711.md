# MyAlice Integration Documentation

# CRM API Integration Documentation
## Overview
This documentation outlines the process of integrating with the CRM API for lead management. The integration involves checking if a lead exists, creating or updating lead information, and managing lead ownership based on agent claims and interaction history.
#### Flow Chart
![](https://t24567161.p.clickup-attachments.com/t24567161/a3afd358-daad-415e-b77f-455e909b2bf8/image.png)
## API Base URL
All API requests should be made to:

```plain
https://crm-api.shikho.com/api/v1/
```

## Authentication
All API requests require authentication using a Bearer token. Include the following header in all requests:

```plain
Authorization : Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMGNmN2I3NTA3YTM4YTkwYmMwMTI1NGQyNjNlMjYxZWQyYjVmYTRiNjhjNTlkMzYzZmIzMTk4OGU1ZDFkOTlhOTIyZTdjNGMxZjliZmNhODkiLCJpYXQiOjE3MzAxMTA0MzQuMTk4NTY3LCJuYmYiOjE3MzAxMTA0MzQuMTk4NTcxLCJleHAiOjE4ODc4NzY4MzQuMTc5Mzk0LCJzdWIiOiIxMzEzIiwic2NvcGVzIjpbXX0.fNCBKgAvOpawzpJ1RuPIG04vPewgLMdm_4Yiosbhy8EzXvLUb_USKrvUQmg5ZHK85lCjR8KWP7RXGOUN9pxbeJPa2Cy6E9d5I1D-nQSDTxUEsuh9GSDbt2iwxQt5DOdCiN4pnxDVhIB62AQu2lMHc7eMNQSaESSNj5sa_1CcMJY5uU3PiiYgZBwf93LIb5YyU3H81LQVPhL-iyt7cOPMLYNJKokJ5K_2ynjTjpRnyV_bEjO3IoPGoOmklv7LmZwOZ37TOfGqLh5Kdm-PMm_TCDsDralWerUitfBTWOW_0eqKhTzNdIUROXSqI7q0K1ye0ooZzSWO7m3cIs87OKBNOfyLjd7_GG74LA_YFwHJnv5dnretTGLhnAzn0dHsa6hdptW937NKGbEL5L4_klRhsuxnTRCILtopswT-9ImHbe3EUxrXrwmY6KM1MMkdoBGL51zCETZD5qrqnVEsOfpS1r6GVPGkcSbRdIDEIEuA0K-1GegZf0duOPRHTTemG09SelBUiOxC_8gTMrcK2xeYFcewdDFKoipetEFqWixH4SBp7CNkxfPOwGjd9kiLM-uh6w8hqqqR8S13b0uaicDQjX2LpZKRSYYZTQf9GuOZlES0TGztvHNzmAHn20B0ABFhY2w_qiC7uWDzq8C26jPjDixiARHR0_WTPy-cBsC4fG4
```

## Check if Lead Exists
### Endpoint

```sql
GET /leads
```

### Query Parameters
*   `search`: Search for a specific mobile number (e.g., `mobile:88XXXXXXXXXX`)
*   `conditions`: Set conditions for the search (e.g., `mobile:=`)
### Example Request

```javascript
const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Log-Ref-Id': 'gform-web-001-0000000000001',
    'Authorization': `Bearer ${TOKEN}`
  }
};

const mobile = '880167129490'

const response = await fetch(`https://crm-api.shikho.com/api/v1/leads?cols=lead_stage_id;prospect_id;owner_id;product_id&search=mobile:${mobile}&conditions=mobile:=`, options);
const data = await response.json();
```

### Response
The API will return an array of leads matching the search criteria. Each lead object contains information such as `id`, `prospect_id`, `product_id`, `owner_id`, and other relevant details.
#### Sample Response

```json
{
    "data": [
        {
            "id": 1637435,
            "mobile": "8801687129490",
            "name": "Rifat Bin Alam Rohit",
            "source": "website-shikho",
            "lead_stage_id": 2,
            "owner_id": 3,
            "status_id": 1,
            "owner": {
                "id": 3,
                "name": "CRM Agent",
                "status_id": 1,
                "deleted_at": null
            },
            "lead_stage": {
                "id": 2,
                "name": "Prospect"
            },
            "district": null,
            "product": null,
            "latest_call": {
                "call_status": "ANSWER",
                "dispo_status": "PROS",
                "created_at": "2025-02-03 11:34:18 pm",
                "id": 5572492,
                "lead_id": 1637435
            },
            "lead_contacts": [],
            "custom_field": []
        },
        {
            "id": 107771,
            "mobile": "8801687129490",
            "name": "Rifat Bin Alam Rohit",
            "source": "Bohubrihi",
            "lead_stage_id": 2,
            "owner_id": 3,
            "status_id": 1,
            "owner": {
                "id": 3,
                "name": "CRM Agent",
                "status_id": 1,
                "deleted_at": null
            },
            "lead_stage": {
                "id": 2,
                "name": "Prospect"
            },
            "district": null,
            "product": null,
            "latest_call": null,
            "lead_contacts": [],
            "custom_field": []
        }
    ],
    "meta": {
        "pagination": {
            "total": 2,
            "count": 2,
            "per_page": 200,
            "current_page": 1,
            "total_pages": 1,
            "links": {}
        }
    }
}
```

### Handling the Response
1. Check if any leads exist for the given mobile number.
2. If leads exist, identify the correct lead based on the `product_id` (1 for Shikho, 2 for Bohubrihi).
3. Extract the `lead_id` and `owner_id` for further processing.
## Create or Update Lead
### Endpoint

```plain
POST /leads/upserts
```

### Request Body
The request body should be a JSON object containing lead information. Key fields include:
*   `product_id`: 1 for Shikho, 2 for Bohubrihi
*   `name`: Lead's name
*   `mobile`: Lead's mobile number (format: 88XXXXXXXXXX)
*   `source`: Lead source (e.g., 'shikho-hotline', 'shikho-messenger')
*   `cf_class`: Class mapping (e.g., 'C6' for Class 6)
*   `cf_query_type`: Type of query (mapped to numeric values)
*   `cf_bb_query_type` : Type of bb query (mapped to numeric values)
*   `cf_query_category`: Category of query (mapped to numeric values)
*   `cf_bb_query_category` : Category of bb query (mapped to numeric values)
*   `cf_query_subcategory`: Subcategory of query (mapped to numeric values)
*   `cf_bb_query_subcategory` : Subcategory of bb query (mapped to numeric values)
*   `cf_query_date`: Date of query (format: ~~YYYY-MM-DD HH:MM:SS~~) New format: **Y-m-dTH:i:sZ (Z or offset +00:00 or -04:50)**
*   `cf_bb_query_date` : Date of bb query (format: ~~YYYY-MM-DD HH:MM:SS~~) New format: **Y-m-dTH:i:sZ (Z or offset +00:00 or -04:50)**
*   `cf_query_source`: Source of query (mapped to numeric values)
*   `cf_bb_query_source` : Source of bb query (mapped to numeric values)
*   `cf_query_lead_medium`: Lead medium (mapped to numeric values)
*   `cf_bb_query_lead_medium` : BB Lead medium (mapped to numeric values)
*   `cf_query_group`: Group information (mapped to numeric values)
*   `cf_query_agent`: Agent name

*   `cf_passing_year` : Lead's passing year (e.g., "2028", "2025")

### Example Request

```javascript
const payload = JSON.stringify({
  product_id: 1,
  name: 'John Doe',
  mobile: '8801XXXXXXXXX',
  source: 'shikho-messenger',
  cf_class: 'C10',
  cf_query_type: 10,
  cf_query_category: 11,
  cf_query_subcategory: 20,
  cf_query_date: '2024-01-01T05:00:00+06:00',
  cf_query_source: 11,
  cf_query_lead_medium: 30,
  cf_query_group: 20,
  cf_query_agent: 'Agent Name'
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Log-Ref-Id': 'gform-web-001-0000000000001',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: payload
};

const response = await fetch('https://crm-api.shikho.com/api/v1/leads/upserts', options);
const data = await response.json();
```

### Response
The API will return the created or updated lead's ID.

```json
{
    "id": 1637435,
    "prospect_id": "9aa013ec-4cae-4c5c-ae21-2ae9bafcc022",
    "message": "Record has been updated successfully"
}
```

## Change Lead Owner (Conditional)
The lead owner is only changed if the agent explicitly requests to claim the lead and the lead has met the following criteria.
### Condition For Changing Owner : Criteria 0 \[MUST BE CHECKED FIRST\]
1. Check if the lead, has `lead_stage_id = 7` OR `lead_stage_id = 18`
    1. ![](https://t24567161.p.clickup-attachments.com/t24567161/6f3c5383-a89c-4dd3-8da2-c5478d3b56b9/CleanShot%202025-05-20%20at%2012.46.29%402x.png)
2. Check if the `owner_id` of the lead is `3`.
3. If the `owner_id` is not `3`, then the `owner_id` of the lead **must not be changed**.
    1. Even if the cx agent has specified that they want to change ownership, the `owner_id` will not be changed.
### Condition For Changing Owner : Criteria 1 \[Lead owner\_id = 3\]
1. If the agent has explicitly selected that they want to claim the lead, then the system will check for the lead owner of the lead.
2. If the **`owner_id`** of the lead is 3 ➝ **`Update the owner_id with the id of the agent.`**
    1. the **`owner_id`** of the lead can be found in JSON that is returned when the lead is checked
        1. ![](https://t24567161.p.clickup-attachments.com/t24567161/83b66e72-ac0d-43da-8b2c-c43c404210ff/image.png)
3. **If this criteria is met, the lead owner should be changed regardless of the stage of the lead or calling date.**
### Condition for Changing Lead : Criteria 2 \[Lead Stage ID — 13 or 15 or 16 or 17\]
1. If the agent has explicitly selected that they want to claim the lead, then the system will check for the lead owner of the lead and the lead stage id.
2. If the **`owner_id`** of the lead **is not 3**, and the **`lead_stage_id`** is **13 or 15 or 16 or 17** , then the owner id of the lead will need to be updated with the agent\_id.
3. The **`lead_stage_id`** can be found by in the response JSON when the lead is checked using the code in the first section.
![](https://t24567161.p.clickup-attachments.com/t24567161/a7c3a573-c412-40c8-b11d-7f5dfef22e7e/image.png)

### Condition for Changing Owner : Criteria 3 \[Last 14 day call check\]
1. Before changing the lead owner, check if the agent has requested to claim the lead and if the lead hasn't been interacted with recently ➝ **`This must be a YES/NO field that the agent has to select in the form`**
2. The lead must not have been interacted with in the last **`14 days`**.
    1. Last 14: Day interaction Check
        ```javascript
        function checkCreatedAt(data) {  
          var createdAt = new Date(data);
          var currentDate = new Date();
          var fourteenDaysAgo = new Date(currentDate);
          fourteenDaysAgo.setDate(currentDate.getDate() - 14);
          return createdAt < fourteenDaysAgo;
        }
        ```
    2. Determining Recent Interaction
        ```javascript
        const last14DaysSpoken = latest_call ? !checkCreatedAt(latest_call.created_at) : false;
        ```
        *   Use the created\_at date in the latest\_call object in the lead check response
            ```plain
            {
              "data": [
                {
                  "product": {
                    "name": "Shikho",
                    "id": 1.0
                  },
                  "lead_stage": null,
                  "latest_call": {
                    "lead_id": 1901666.0,
                    "call_status": "CONGESTION",
                    "id": 3048883.0,
                    "created_at": "2024-10-14 04:17:47 PM", #this is the last_called_date that is going to be used to check if the lead has been called in the last 14 days.
                    "dispo_status": "DNP"
                  },
                  "product_id": 1.0,
                  "owner": {
                    "id": 1151.0,
                    "name": "Lima Paik"
                  },
                  "owner_id": 1151.0,
                  "id": 1901666.0,
                  "district": null,
                  "prospect_id": "e2ed584a-a373-41e7-89dc-eef1375a2253"
                }
              ],
              "meta": {
                "pagination": {
                  "total": 1.0,
                  "current_page": 1.0,
                  "count": 1.0,
                  "per_page": 200.0,
                  "total_pages": 1.0,
                  "links": {}
                }
              }
            }
            ```
### Condition for Changing Owner : Criteria 4 \[If lead is assigned and stage\_id is 2 and no call has been for the 48 working hours\]
1. Before changing the lead owner, check if the agent has requested to claim the lead and if the lead hasn't been interacted with recently - **`This must be a YES/NO field that the agent has to select in the form`** .
2. The lead must not have been interacted with - for the 48 working hours and lead stage id must be 2
###   

### API Endpoints
#### Endpoint

```plain
PUT /leads/{lead_id}/owner-assigns
```

#### Request Body
The request body should be a JSON object containing the new owner's ID:

```json
{
  "owner_id": NEW_OWNER_ID
}
```

#### Example Request

```json
const payload = JSON.stringify({
  owner_id: agentID
});

const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Log-Ref-Id': 'myalice-web-001-0000000000001',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: payload
};

const response = await fetch(`https://crm-api.shikho.com/api/v1/leads/${lead_id}/owner-assigns`, options);
const data = await response.json();
```

#### Response
The API will return a success message if the owner was changed successfully.

## Changing Lead Stage
### Endpoint

```plain
PUT /leads/{lead_id}/stage-assigns
```

### Request Body
The request body should be a JSON object containing the new stage ID:

```json
{
  "lead_stage_id": NEW_STAGE_ID
}
```

### Example Request

```json
const payload = JSON.stringify({
  lead_stage_id: 2
});

const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Log-Ref-Id': 'gform-web-001-0000000000001',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: payload
};

const response = await fetch(`https://crm-api.shikho.com/api/v1/leads/${leadId}/stage-assigns`, options);
const data = await response.json();
```

### Response
The API will return a success message if the stage was changed successfully.
* * *
# Data Mappings
The integration uses various mappings for different fields. Here are all the mappings:
## Class Mapping

```plain
"Class 5": "C5"
"Class 6": "C6",
"Class 7": "C7",
"Class 8": "C8",
"Class 9": "C9",
"Class 10": "C10",
"Class 11": "C11",
"Class 12": "C12"
```

## Agent Mapping

```plain
"MD Mijanur Rahman": 162,
"Jannatul Ferdous": 1051,
"Md. Nafis Siddque": 1052,
"Moriom Akter Mukta": 1053,
"Sakib Khan": 1054,
"Hafizul Islam": 1055,
"Sumaiya Akter": 1056,
"Imtiaz Ahmed Adnan": 1057,
"Saad Bin Bashar": 1058,
"Monira Khatun" : 1043,
"Md. Shaddin Hossain" : 1042,
"Abdul Mannan Molla" : 1038,
"Md. Abu Talha" : 1385,
"Md. Abid Hasan Rabbi" : 1386,
"Asifullah Sizan" : 1484,
"Bilkis Akter Borsha" : 1485,
"Abu Saleh" : 1516,
"MD. Alamin" : 1517,
"Esmat Jahan Ema" : 1802,
"Tania Akter Tangila" : 1783
```

## Inquiry Mapping

```plain
  'General Inquiry' : "General Inquiry Categories",
  'Product Issue' : "Product Issue Categories",
  'Customer Request' : "Customer Request Categories",
  'Customer Voice' : "Customer Voice Categories" 
  'Miscellaneous' : "Miscellaneous Categories"
```

## Source Mapping

```plain
  'Messenger' : 'shikho-messenger',
  'Webchat' : 'shikho-webchat',
  'BB Messenger' : 'bb-messenger',
  'BB Webchat' : 'bb-webchat',
  'Whatsapp' : 'shikho-whatsapp',
  'BB Whatsapp' : bb-whatsapp,
```

## Occupation Mapping

```plain
  "School/College Student" : "scs",
  "University Student" : "vs",
  "Job Seeker" : "js",
  "Service Holder" : "sh",
  "Freelancer" : "freelancer",
  "Entrepreneur" : "entrepreneur",
```

## Query Type Mapping

```plain
    'General Inquiry': 10,
    'Product Issue': 11,
    'Customer Request': 12,
    'Customer Voice': 13,
    'Miscellaneous' : 14
```

## BB Query Type Mapping

```plain
    'General Inquiry': 10,
    'Product Issue': 11,
    'Customer Request': 12,
    'Customer Voice': 13,
```

## Category Mapping

```plain
    'Course Details': 10,
    'Course Enroll/ Payment/ Discount': 11,
    'After Sales Service': 12,
    'Goodies': 13,
    'Sponsorship': 14,
    'Career & Contact': 15,
    'Account': 16,
    'App/Web': 17,
    'Video Content': 18,
    'Study Materials': 19,
    'Course': 20,
    'Product/Feature/Discount': 21,
    'Promotional Partner': 22,
    'Positive Voice': 23,
    'Negative Voice': 24,
    'Shikho AI' : 25,
    'Others': 26
```

## BB Category Mapping

```plain
    'Course Details': 10,
    'Course Enroll/ Payment/ Discount': 11,
    'After Sales Service': 12,
    'Goodies': 13,
    'Sponsorship': 14,
    'Career & Contact': 15,
    'Account': 16,
    'App/Web': 17,
    'Video Content': 18,
    'Study Materials': 19,
    'Course': 20,
    'Product/Feature/Discount': 21,
    'Promotional Partner': 22,
    'Positive Voice': 23,
    'Negative Voice': 24,
```

## Query Source Mapping

```plain
  "Hotline" : 10,
  "Messenger" : 11,
  "Webchat" : 12,
  "Instagram" : 13,
  "Email" : 14,
  "Referral" : 15,
  "Whatsapp": 16,


```

## Medium Mapping

```plain
    'Paid Ad': 30,
    'Others': 31,
    'Facebook Ad' : 32,
    'Youtube Ad' : 33,
    'Google Ad' : 34,
    'Shikho App' : 35,
    'Shikho Page' : 36,
    'Shikho Group' : 37,
    'Friends of Friends' : 38,
    'Shikho Website' : 39,
    'Other Apps (MyGp/bKash)' : 40,


```

## BB Medium Mapping

```plain
    'Paid Ad': 10,
    'Others': 11,
    'Facebook Ad' : 12,
    'Youtube Ad' : 13,
    'Google Ad' : 14,
    'BB Website' : 15,
    'BB Page' : 16,
    'BB Group' : 17,
    'Other Apps (MyGp/bKash)' : 18,
    'Friends of Friends' : 19,
```

## BB Query Source Mapping

```plain
  "Hotline" : 10,
  "Messenger" : 11,
  "Webchat" : 12,
  "Instagram" : 13,
  "Email" : 14,
  "Referral" : 15,
  "Whatsapp": 16,
```

## Group Mapping

```plain
    'Science': 20,
    'Business Studies': 21,
    'Humanities': 22,
    'None': 23,
```

## BB Query Occupation Mapping

```plain
    "School/College Student" : 10,
    "University Student" : 11,
    "Job Seeker" : 12,
    "Service Holder" : 13,
    "Freelancer" : 14,
    "Entrepreneur" : 15,
```

## Subcategory Mapping

```plain
    'Price': 10,
    'Availability': 11,
    'Duration & Validity': 12,
    'Class Time & Routine': 13,
    'Upcoming Course Inquiry': 14,
    'Content Inquiry': 15,
    'Mentors Inquiry': 16,
    'Offline Course Inquiry': 17,
    'Exchange / Refund': 18,
    'Free Course': 19,
    'Paid Course': 20,
    'Quarterly Repurchase': 21,
    'Installment': 22,
    'Yearly Renew': 23,
    'Admission Process': 24,
    'Available Discounts': 25,
    'Edit Profile': 26,
    'Syllabus Change': 27,
    'TA Support/ Mentor Support': 28,
    'FB Group Link': 29,
    'T Shirt Update': 30,
    'Notebook Update': 31,
    'Campaign Specific': 32,
    'Promotional Interest': 33,
    'GPA-5 Reception': 34,
    'Job Opening Inquiry': 35,
    'Contact Details Request': 36,
    'Registration Issue': 37,
    'Log in Problem': 38,
    'Affiliate Dashboard Issue': 39,
    'Delete Account': 40,
    'App Launch Issue': 41,
    'Server Down': 42,
    'Did not get OTP': 43,
    'Wrong OTP': 44,
    'Video Buffering': 45,
    'Video Mismatched': 46,
    'Unable to See Animated Video': 47,
    'Unable to See Live Class Video': 48,
    'Unable to See Recorded Class Video': 49,
    'Video Missing': 50,
    'Unable to Download Video': 51,
    'PDF/Smart Note Missing': 52,
    'Unable to Submit Quiz': 53,
    'Unable to Submit Exam': 54,
    'Course Not Found': 55,
    'Unable to Enroll Course' : 56,
    'Promo not Working/ Inapplicable' : 57, 
    'Scholarship/ More Discount Request' : 58, 
    'Sponsorship Request' : 59,
    'Partnership Request' : 60,
    'New Feature Request' : 61,
    'New App Request' : 62,
    'New Course Request' : 63,
    'Fixed OTP Request' : 64,
    'Refund Request' : 65,
    'Course Exchange' : 66,
    'Wants to be Campus Ambassador' : 67,
    'Wants to be Affiliate' : 68,
    'Process Related (Non Technical)' : 69,
    'System Related (Technical)' : 70,
    'Content Related' : 71,
    'Instructor Related' : 72,
    'CX Support Related' : 73,
    'Process Related (Non Technical)' : 74,
    'System Related (Technical)' : 75,
    'Content Related' : 76,
    'Instructor Related' : 77,
    'CX Support Related' : 78,
    'Promotional Call/Text Off' : 79,
    'English Version Course Availability' : 80,
    'FB Group Post Approval Request' : 81,
    'Exam Submission Process' : 82,
    'Shop Related Inquiry' : 83, 
    'AI Package & Price' : 84,
    'AI Purchase Process' : 85,
    'AI How to Use' : 86,
    'AC Verification' : 87,
    'Other Service Related' : 88,
    'Drop/No Response' : 89,
    'Spam/Prank' : 90


```

## BB Subcategory Mapping

```plain
    'Price': 10,
    'Availability': 11,
    'Duration & Validity': 12,
    'Class Time & Routine': 13,
    'Upcoming Course Inquiry': 14,
    'Content Inquiry': 15,
    'Mentors Inquiry': 16,
    'Offline Course Inquiry': 17,
    'Exchange / Refund': 18,
    'Free Course': 19,
    'Paid Course': 20,
    'Quarterly Repurchase': 21,
    'Installment': 22,
    'Yearly Renew': 23,
    'Admission Process': 24,
    'Available Discounts': 25,
    'Edit Profile': 26,
    'Syllabus Change': 27,
    'TA Support/ Mentor Support': 28,
    'FB Group Link': 29,
    'T Shirt Update': 30,
    'Notebook Update': 31,
    'Campaign Specific': 32,
    'Promotional Interest': 33,
    'GPA-5 Reception': 34,
    'Job Opening Inquiry': 35,
    'Contact Details Request': 36,
    'Registration Issue': 37,
    'Log in Problem': 38,
    'Affiliate Dashboard Issue': 39,
    'Delete Account': 40,
    'App Launch Issue': 41,
    'Server Down': 42,
    'Did not get OTP': 43,
    'Wrong OTP': 44,
    'Video Buffering': 45,
    'Video Mismatched': 46,
    'Unable to See Animated Video': 47,
    'Unable to See Live Class Video': 48,
    'Unable to See Recorded Class Video': 49,
    'Video Missing': 50,
    'Unable to Download Video': 51,
    'PDF/Smart Note Missing': 52,
    'Unable to Submit Quiz': 53,
    'Unable to Submit Exam': 54,
    'Course Not Found': 55,
    'Unable to Enroll Course' : 56,
    'Promo not Working/ Inapplicable' : 57,
    'Scholarship/ More Discount Request' : 58,
    'Sponsorship Request' : 59,
    'Partnership Request' : 60,
    'New Feature Request' : 61,
    'New App Request' : 62,
    'New Course Request' : 63,
    'Fixed OTP Request' : 64,
    'Refund Request' : 65,
    'Course Exchange' : 66,
    'Wants to be Campus Ambassador' : 67,
    'Wants to be Affiliate' : 68,
    'Process Related (Non Technical)' : 69,
    'System Related (Technical)' : 70,
    'Content Related' : 71,
    'Instructor Related' : 72,
    'CX Support Related' : 73,
    'Process Related (Non Technical)' : 74,
    'System Related (Technical)' : 75,
    'Content Related' : 76,
    'Instructor Related' : 77,
    'CX Support Related' : 78,
    'Promotional Call/Text Off' : 79,


```