chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
                if (request.action === 'getCountryCode') {
                    sendResponse({countryCode: JSON.parse(localStorage.countryCode)});
                }
            });

            if (!localStorage.hasOwnProperty('countryCode')) {
                localStorage.countryCode = '{"de":true,"uk":true,"com":true,"fr":true,"it":true,"es":true,"cn":true,"jp":true}';
            }
