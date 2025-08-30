import { Configuration, PublicClientApplication, SilentRequest } from "@azure/msal-browser";

const configuration: Configuration = {
  auth: {
    clientId: process.env.REACT_APP_DATAVERSE_CLIENT_ID!,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_DATAVERSE_TENANT_ID}`,
    redirectUri: 'http://localhost:3000'
  }
};

const pca = new PublicClientApplication(configuration);

const authHeader = async () => {
  const accounts = pca.getAllAccounts();
  if (accounts.length > 0) {
    const tokenRequest: SilentRequest = {
      scopes: [process.env.REACT_APP_DATAVERSE_AUTH_SCOPE!],
      account: accounts[0]
    };

    try {
      const response = await pca.acquireTokenSilent(tokenRequest);
      return `Bearer ${response.accessToken}`;
    } catch (error) {
      console.error("Error acquiring token:", error);
    }
  }
}

export { configuration, pca, authHeader };