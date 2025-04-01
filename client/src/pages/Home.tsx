import { useContext, useEffect, useState } from "react";

// components
import { PageContainer, PageFooter } from "@/components";
import AdminIconButton from "@/components/AdminIconButton";
import AdminView from "@/components/AdminView";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";

import { backendAPI, setErrorMessage } from "@/utils";


interface PollData {
  question: string;
  answers: string[];
  displayMode: "percentage" | "count";
}


const Home = () => {

  const [showSettings, setShowSettings] = useState(false);
  const [pollData, setPollData] = useState<PollData | null>(null);
  const dispatch = useContext(GlobalDispatchContext);

  const { visitor } = useContext(GlobalStateContext);


  
  useEffect(() => {
    backendAPI
      .get("/updatePoll")
      .then((res) => {
        const poll = res.data.poll;
        // console.log("Poll data!!!!!!!!!:", poll);
        setPollData(poll ?? null);
      })
      .catch((error) =>
        setErrorMessage(dispatch, error)
      );
  }, []);

  // const credentials = getCredentials(req.query);
  // const { assetId, urlSlug } = credentials;


  if (!visitor) {
    return <div>Loading...</div>;
  }

  const handleVote = (optionIndex: number) => {
    backendAPI
      .post("/vote", { 
        optionId: optionIndex,
        profileId: visitor.profileId,
      })
      .then((res) => {
        console.log(visitor.profileId, "VOTED FOR:", optionIndex);
        console.log("Vote submitted successfully", res.data);
        // return backendAPI.get("/updatePoll")
      })
      .then((res) => {
        const poll = res.data.poll;
        // console.log("Poll data!!!!!!!!!:", poll);
        setPollData(poll ?? null);
      })
      .catch((error) =>
        setErrorMessage(dispatch, error)
      );
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
            {pollData ? (
              <section className="mt-6">
                <h3>Current Poll (DEBUG)</h3>
                <p><strong>Question:</strong> {pollData.question}</p>
                <ul className="list-disc ml-6">
                  {pollData.answers?.map((ans, i) => (
                    <li key={i} className="flex items-center">
                      <span>{ans}</span>
                      <button
                        onClick={() => handleVote(i)}
                        className="ml-4 btn btn-sm btn-primary"
                      >
                        Vote
                      </button>
                    </li>
                  ))}
                </ul>
                <p><strong>Display Mode:</strong> {pollData.displayMode}</p>
              </section>
            ) : (
              <p>No active poll found.</p>
            )}
          </div>
        )}
    </div>
  );
};

export default Home;
