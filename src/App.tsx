import "./App.css";
import { useEffect, useState } from "react";
import PollWidget from "./components/PollWidget";
import type { Poll } from "./types";
import { fetchPoll, removeVote, submitVote } from "./db/api";

function App() {
    const [pollData, setPollData] = useState<Poll | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // passsing 41 as pollId
                const data = await fetchPoll(41);
                setPollData(data);
            } catch (error) {
                console.error("Failed to load poll", error);
            }
        }

        fetchData();
    }, []);
    if (!pollData) return <div> Loading...</div>;
    return (
        <div className="min-h-screen items-start flex pt-20 justify-center bg-gray-300">
            <PollWidget
                pollId={pollData.id}
                title={pollData.question}
                options={pollData.options}
                isMultiple={true}
                onVote={submitVote}
                onVoteRemove={removeVote}
                // styles={{}}
            />
        </div>
    );
}

export default App;
