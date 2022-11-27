import * as React from "react";
import { AuthProvider } from "./context/AuthContext";
import { PostProvider } from "./context/PostContext"
import Navigation from "./Navigation";

const App = () => {
  return (

      <AuthProvider>
          <PostProvider >
            <Navigation />
          </PostProvider>
      </AuthProvider>

  )
}

export default App;
