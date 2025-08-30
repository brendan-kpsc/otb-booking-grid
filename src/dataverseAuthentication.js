export const dataverseAuthentication = async (accessTokenURL, clientId, clientSecret, scope) => {
    await fetch(accessTokenURL, {
        method: 'POST',
        headers: {
            'Accept-Encoding': 'gzip, deflate',
            'Accept': '*/*',
            'Connection': 'keep-alive'
        },
        body: JSON.stringify({
            grant_type: "client_credentials",
            addTokenTo: "header",
            client_authentication: "header",
            challengeAlgorithm: "S256",
            tokenName: "Dataverse Token",
            client_id: clientId,
            client_secret: clientSecret,
            scope: scope
        })
    })
    .then(res => res.data)
    .then(data => console.log(data));
}