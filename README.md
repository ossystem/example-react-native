The Purpose Of The Component:
    1) to authenticate a user based on his mobile number
    2) to make sure that this number belongs to a user (the check is done through sending SMS to this phone number)
    3) in case of success to let the user in
    4) if not success tell the user about the access denied error


State of component:
    phone - the value entered by the user in the phone input
    code  - value entered by user code message which he has come
    active - the flag for the submit button disable = true/false
    smsOut - flag for showing that the message is gone
    isFrance - the standard flag for the application, in this case affecting the display and validation of the user number
    placeholder - standart placeholder to flag isFrance = true

Component methods:
    onPress()
        1) после ввода телефона и нажатия на кнопку отправляеться на сервер номер телефона
        2) в случае когда пользователь ввел полученный код и нажал на кнопку, отправляеться запрос на сервер с кодом и сравнивает соответствия
        3) есть возможность ввести сразу номер и код без ожидания смс от сервера


    numberHandler()
        1) validation of entered numbers depending on location ( France, otherwise ) the consequence of which makes
            active = true/false component status flag) and on/off "Login" button 
        2) depending on the validation returns a button with different States


    onRenderFlag()
        1) changing component view after clicking on it
        2) depending on the kind of tab ( France || Other ) change placeholders and number validation


    onInputChange()
        1) parse data from input field of phone number
        2) writes a phone number in a convenient form in the component status ( phone )


Libraries / Components:
        • react
        • react-native
        • react-native-masked-text
            component for react-native which holds the input text through a specified mask
        • ../components/Button
            template button project
        • react-native-device-info
            a library for geocoding names and some business telephone data (phone id etc.)
        • ../il8n
            the function which is seeking entry into the dictionary and returns it
        • ../../config
            the file which contains all the paths for requests or connections to the server
