# Create Events In CRM

*   **Recorded Class V2 Event**
    1. Event Creation Endpoint -
    
    ```plain
    Method - POST
    URL - https://crm-api.shikho.com/api/v1/events
    ```
    
    2. Event Parameters -
        ```plain
        {
         "type":"campaign_form_submission",
          "product_id": 1,
          "lead_prospect_id": "${prospectID}",
          "cf_form_type": ORGANIC,
          "cf_form_name" : "YT_Free_Video",
          "cf_group": "NONE",
          "cf_passing_year": "2025"
          "cf_class" : "C5"
        }
        ```
    3. CURL
        ```plain
        curl --location 'https://crm-api.shikho.com/api/v1/events' \
        --header 'sec-ch-ua: "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"' \
        --header 'sec-ch-ua-mobile: ?0' \
        --header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36' \
        --header 'Authorization: Bearer YOUR TOKEN' \
        --header 'accept: application/json' \
        --header 'Referer: https://crm.shikho.com/' \
        --header 'X-Log-Ref-Id: crm-web-005-1723444280461' \
        --header 'sec-ch-ua-platform: "macOS"' \
        --header 'Content-Type: application/json' \
        --data '{
            "type": "recorded_class_clicked_agg",
            "product_id": 1,
            "lead_prospect_id": "f50ba0c6-3ac8-4c77-be82-e5cac8d2a442",
            "cf_event_count": 74,
            "cf_subject_list": "ইংরেজী ১ম পত্র, উচ্চতর গণিত, উচ্চতর গণিত রিভিশন, গণিত, জীববিজ্ঞান, তথ্য ও যোগাযোগ প্রযুক্তি রিভিশন, পদার্থবিজ্ঞান, পদার্থবিজ্ঞান রিভিশন, বাংলা ১ম পত্র, বাংলা ১ম পত্র রিভিশন, বাংলা ২য় পত্র, বাংলাদেশ ও বিশ্ব পরিচয় - SSC25, রসায়ন, রসায়ন রিভিশন",
            "cf_event_date": "2024-10-14 00:00:00"
        }'
        ```