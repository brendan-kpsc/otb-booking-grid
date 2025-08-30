import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";
import BookingGrid from "./view/Booking-Scheduler/index";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import apiClientState from "./atoms/apiClient";
import createNewClient from "./odata-wrapper/odata-client";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { EventMessage, EventType, InteractionType, PopupRequest } from "@azure/msal-browser";
import { pca } from "./msalConfig";
import { ODataV4 } from "@odata/client/lib/types_v4";

const GRID_HEIGHT = 400;

function App() {
  const setApiClient = useSetRecoilState(apiClientState);

  useEffect(() => {
    createNewClient(process.env.REACT_APP_DATAVERSE_API_URL!, process.env.REACT_APP_IS_DEVELOPMENT === 'true')
      .then((client: ODataV4) => setApiClient(client));
  }, [setApiClient]);

  const authRequest: Partial<PopupRequest> = {
    scopes: [process.env.REACT_APP_DATAVERSE_AUTH_SCOPE!]
  };

  if (process.env.REACT_APP_IS_DEVELOPMENT === 'true') {
    pca.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        createNewClient(process.env.REACT_APP_DATAVERSE_API_URL!, process.env.REACT_APP_IS_DEVELOPMENT === 'true')
          .then((client: ODataV4) => setApiClient(client));
      }
    });
  }

  return (
    <div className="App">
        {
          process.env.REACT_APP_IS_DEVELOPMENT === 'true' ?
            (
              <MsalProvider instance={pca}>
                <MsalAuthenticationTemplate
                  interactionType={InteractionType.Redirect}
                  authenticationRequest={authRequest}
                >
                  <BookingGrid height={GRID_HEIGHT} />
                </MsalAuthenticationTemplate>
              </MsalProvider>
            ) :
            <BookingGrid height={GRID_HEIGHT} />
        }
    </div>
  );
}

export default App;
