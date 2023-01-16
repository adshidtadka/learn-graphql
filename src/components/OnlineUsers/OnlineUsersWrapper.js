import React, { useState, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";

import OnlineUser from "./OnlineUser";

const OnlineUsersWrapper = () => {
  const [onlineIndicator, setOnlineIndicator] = useState(0);
  let onlineUsersList = [];

  const UPDATE_LASTSEEN_MUTATION = gql`
    mutation updateLastSeen($now: timestamptz!) {
      update_users(where: {}, _set: { last_seen: $now }) {
        affected_rows
      }
    }
  `;
  const [updateLastSeenMutation] = useMutation(UPDATE_LASTSEEN_MUTATION);
  const updateLastSeen = () => {
    // Use the apollo client to run a mutation to update the last_seen value
    updateLastSeenMutation({
      variables: { now: new Date().toISOString() },
    });
  };
  const onlineUsers = [{ name: "someUser1" }, { name: "someUser2" }];

  useEffect(() => {
    // Every 20s, run a mutation to tell the backend that you're online
    updateLastSeen();
    setOnlineIndicator(setInterval(() => updateLastSeen(), 20000));
    return () => {
      // Clean up
      clearInterval(onlineIndicator);
    };
  }, []);

  onlineUsers.forEach((user, index) => {
    onlineUsersList.push(<OnlineUser key={index} index={index} user={user} />);
  });

  return (
    <div className="onlineUsersWrapper">
      <div className="sliderHeader">Online users - {onlineUsers.length}</div>
      {onlineUsersList}
    </div>
  );
};

export default OnlineUsersWrapper;
