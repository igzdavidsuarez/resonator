Feature: the server receives a request to send SMS messages

  Scenario Outline: send SMS messages to a set of Identity objects
    Given an authenticated identity in the app with <identity_id>
    Then a mock request is sent to <endpoint> to send an SMS message <sms> and returns <response>

    Examples:
      | identity_id              | endpoint      | sms                         | response                             |
      | 01f0000000000000003f0001 | /api/push/sms | sms/valid_sms.json          | sms/valid_sms_response.json          |
      | 01f0000000000000003f0002 | /api/push/sms | sms/invalid_to_phone.json   | sms/invalid_to_phone_response.json   |
      | 01f0000000000000003f0003 | /api/push/sms | sms/invalid_from_phone.json | sms/invalid_from_phone_response.json |