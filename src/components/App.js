import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Header from "./Header";
import Login from "./Auth/Login";
import TodoPrivateWrapper from "./Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "./Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "./OnlineUsers/OnlineUsersWrapper";

import useAccessToken from "../hooks/useAccessToken";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: "wss://hasura.io/learn/graphql",
      options: {
        lazy: true,
        reconnect: true,
        connectionParams: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      },
    }),
    cache: new InMemoryCache(),
  });
};

const App = () => {
  const idToken = useAccessToken();
  const { loading, logout } = useAuth0();

  const [client, setClient] = useState(createApolloClient(idToken));

  useEffect(() => {
    if (!loading && idToken) {
      setClient(createApolloClient(idToken));
    }
  }, [loading, idToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!idToken) {
    return <Login />;
  }

  if (!client) {
    return <div>Error...</div>;
  }

  return (
    <ApolloProvider client={client}>
      <div>
        <Header logoutHandler={logout} />
        <div className="row container-fluid p-left-right-0 m-left-right-0">
          <div className="row col-md-9 p-left-right-0 m-left-right-0">
            <div className="col-md-6 sliderMenu p-30">
              <TodoPrivateWrapper />
            </div>
            <div className="col-md-6 sliderMenu p-30 bg-gray border-right">
              <TodoPublicWrapper />
            </div>
          </div>
          <div className="col-md-3 p-left-right-0">
            <div className="col-md-12 sliderMenu p-30 bg-gray">
              <OnlineUsersWrapper />
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default App;
