import { useContext, useEffect, useState } from "react";

// components
import { PageContainer, PageFooter } from "@/components";
import AdminIconButton from "@/components/AdminIconButton";
import AdminView from "@/components/AdminView";

// context
import { GlobalStateContext } from "@/context/GlobalContext";


interface PollData {
  question: string;
  answers: string[];
  displayMode: "percentage" | "count";
}


const Home = () => {

  const [showSettings, setShowSettings] = useState(false);

  const { visitor } = useContext(GlobalStateContext);


  // const credentials = getCredentials(req.query);
  // const { assetId, urlSlug } = credentials;

  if (!visitor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-6">
        {/* Conditionally render the admin button if visitor exists and is an admin */}
        {visitor && visitor.isAdmin && (
          <div className="flex justify-end mb-4">
            <AdminIconButton
              setShowSettings={() => setShowSettings(!showSettings)}
              showSettings={showSettings}
            />
          </div>
        )}

        {/* Conditionally display what we wanna show for Admins: */}
        {showSettings ? (
          <AdminView />
        ) : (
          <div>
            <h1 className="h2 text-center">Voting App Dashboard</h1>
            {/* Normal Voting App content vvvvvvvv */}
            <p>Welcome to the Voting App. Cast your vote below!</p>
          </div>
        )}
    </div>
  );
};

export default Home;
