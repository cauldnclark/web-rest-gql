import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import "./App.css";

const GET_USERS = gql`
  query users {
    getUsers {
      username
      age
      dateOfBirth
      isOnline
    }
  }
`;

const ADD_USER = gql`
  mutation addUser($data: AddUserInput!) {
    addUser(data: $data) {
      user {
        username
      }
      success
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUserMutation($username: String!, $isOnline: Boolean) {
    updateUser(username: $username, isOnline: $isOnline) {
      user {
        username
      }
      success
    }
  }
`;

type User = {
  username: string;
  age: number;
  dateOfBirth: Date;
  isOnline: boolean;
};

type ApolloData = {
  getUsers: User[];
};

function App() {
  const { error, loading, data, refetch } = useQuery<ApolloData>(GET_USERS);
  const [mutateAddUser, { loading: addUserLoading }] = useMutation(ADD_USER);
  const [mutateUpdateUser, { loading: updateUserLoading }] =
    useMutation(UPDATE_USER);

  return (
    <div className="App">
      <br />
      <form
        onSubmit={async (event: any) => {
          event.preventDefault();
          const username = event.target["username"].value;
          const isOnline = event.target["isOnline"].checked;
          const age = event.target["age"].value;

          try {
            // await mutateUpdateUser({
            //   variables: {
            //     username,
            //     isOnline,
            //   },
            // });
            await mutateAddUser({
              variables: {
                data: {
                  username,
                  isOnline,
                  age: parseInt(age),
                  dateOfBirth: "1999-07-25T08:37:03.188Z",
                },
              },
            });

            await refetch();
          } catch (error) {
            console.log(error.message);
          }
        }}
      >
        <label htmlFor="username" style={{ fontSize: 20 }}>
          Username
          <input type="text" name="username" />
        </label>
        <div></div>
        <label htmlFor="age" style={{ fontSize: 20 }}>
          Age
          <input type="number" name="age" />
        </label>
        <div></div>
        <label htmlFor="isOnline" style={{ fontSize: 20 }}>
          Is Online?
          <input type="checkbox" name="isOnline" />
        </label>
        <button type="submit">FIRE</button>
      </form>
      <br />
      {(loading || addUserLoading) && <h2>Loading...</h2>}
      {error && <h1>{error.message}</h1>}
      {data && data.getUsers && (
        <pre>
          {data.getUsers.map((i) => (
            <samp key={i.username} style={{ fontSize: 30 }}>
              <ul style={{ listStyle: "none" }}>
                <li>{i.username}</li>
                <li>{i.age}</li>
                <li>{i.dateOfBirth}</li>
                <li
                  style={{
                    height: 20,
                    width: 20,
                    borderRadius: "50%",
                    background: i.isOnline
                      ? "mediumaquamarine"
                      : "rebeccapurple",
                  }}
                ></li>
              </ul>
            </samp>
          ))}
        </pre>
      )}
    </div>
  );
}

export default App;
