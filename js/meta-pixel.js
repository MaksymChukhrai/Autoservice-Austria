// Конфигурация
const CONFIG = {
    pixelId: '1071062520995467',
    businessId: '971574954805384',
    accessToken: 'EAA2CZAuNcWIABO3lBwWWmiffg4x2mOkXRWZC4ontg8653scwthAsBPZAzE6LfK9mI0slH5ftP9zo0tHd1cAtGo0M1vPkZCk4x5YySbsXro4ZArzk9ZAaS6O25GrATPXnJe3ddRaj43OFJD2wnZCZCaNCHw8NZCpBhJAP1qmwj4LnXXbklQ5PqIZCkH03a0VC6GhgGVZBwZDZD',
    testEventCode: 'TEST91552', // ⚠️ Замените на ваш Test Event Code из Events Manager
    apiVersion: 'v17.0'
};

// Инициализация Meta Pixel
!function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){

      n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)
    };
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window,document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

// Функция для отправки событий через CAPI
async function sendToCapi(eventName, eventId) {
    const userData = {
        client_user_agent: navigator.userAgent,
        client_ip_address: null,
        event_source_url: window.location.href,
        domain: window.location.hostname
    };

    const eventData = {
        data: [{
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: eventId,
            event_source_url: window.location.href,
            action_source: 'website',
            user_data: userData
        }],
        test_event_code: CONFIG.testEventCode
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/${CONFIG.apiVersion}/${CONFIG.businessId}/events`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.accessToken}`
                },
                body: JSON.stringify(eventData)
            }
        );
        
        const result = await response.json();
        console.log(`CAPI Response for ${eventName}:`, result);
        
        if (!response.ok) {
            throw new Error(result.error?.message || 'Unknown error');
        }
    } catch (error) {
        console.error(`CAPI Error for ${eventName}:`, error);
    }
}

// Инициализация

fbq('init', CONFIG.pixelId);


// Функция для отправки событий
function trackEvent(eventName) {
    const eventId = `${eventName.toLowerCase()}_${Date.now()}`;
    fbq('track', eventName, {}, {eventID: eventId});
    sendToCapi(eventName, eventId);
    
}

// Отправка событий
trackEvent('PageView');
trackEvent('ViewContent');
trackEvent('Lead');