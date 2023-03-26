import { useEffect } from "react";

const HubspotContactForm = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.hsforms.net/forms/embed/v2.js';
        document.body.appendChild(script);

        script.addEventListener('load',() => {
            if (window.hbspt) {
                window.hbspt.forms.create({
                    region: "na1",
                    portalId: "23493474",
                    formId: "7a886d0d-aae3-4cd0-a059-7b04bbad97d9",
                    target: '#hubspotForm'
                })
            }
        })
    }, [])

    return (
        <>
            <div id='hubspotForm'></div>
        </>
    )
}

export default HubspotContactForm