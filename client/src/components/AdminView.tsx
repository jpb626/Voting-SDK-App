import { useState } from "react";

import { PageFooter, ConfirmationModal } from "@/components";
import { backendAPI } from "@/utils/backendAPI";

interface PollFormInputs {
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
  displayMode: 'percentage' | 'count';
}

export const AdminView = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<PollFormInputs>({
    question: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
    displayMode: "percentage",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleToggleShowConfirmationModal() {
    setShowConfirmationModal(!showConfirmationModal);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // This function will be called when the user clicks the "Save" button
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    backendAPI
      .put("/updatePoll", formData)
      .then(() => {
        console.log("Poll updated successfully");
      })
      .catch((error) =>
        setErrorMessage(
          error?.response?.data?.message || error.message || "Error updating poll"
        )
      )
      .finally(() => setIsSubmitting(false));
  };
  
  

  return (
    <div style={{ position: "relative", maxHeight: "80vh", overflowY: "auto" }}>
      <div className="container grid gap-4">
        <h2 className="h3">Create or Update Poll</h2>
        
        <label>Question</label>
        <input 
          className="input" 
          name="question" 
          value={formData.question} 
          onChange={handleChange} 
        />
        
        {["answer1", "answer2", "answer3", "answer4", "answer5"].map((field, index) => (
          <div key={index}>
            <label>Option {index + 1}</label>
            <input 
              className="input" 
              name={field} 
              value={formData[field as keyof PollFormInputs]} 
              onChange={handleChange} 
            />
          </div>
        ))}

        <label>Display Results As</label>
        <div>
          <label>
            <input 
              type="radio" 
              name="displayMode" 
              value="percentage" 
              checked={formData.displayMode === "percentage"} 
              onChange={handleChange} 
            />
            Percentage
          </label>
          <label>
            <input 
              type="radio" 
              name="displayMode" 
              value="count" 
              checked={formData.displayMode === "count"} 
              onChange={handleChange} 
            />
            Number of Votes
          </label>
        </div>

        {/* Buffering section below the input form options */}
        <div style={{ marginBottom: "2rem" }}></div>
      </div>
      
      <PageFooter>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Save"}
        </button>
        <button 
          className="btn btn-danger" 
          onClick={handleToggleShowConfirmationModal}
        >
          Reset
        </button>
      </PageFooter>
      
      {showConfirmationModal && (
        <ConfirmationModal handleToggleShowConfirmationModal={handleToggleShowConfirmationModal} />
      )}
    </div>
  );
};

export default AdminView;



// import { useState } from "react";
// import { ConfirmationModal } from "@/components";
// // TODO: replace this import with your actual DroppedAsset hook or context
// import { useDroppedAsset } from "@/utils/topia";

// const AdminView: React.FC = () => {
//   const droppedAsset = useDroppedAsset();

//   const [question, setQuestion] = useState("");
//   const [answers, setAnswers] = useState<string[]>(["", "", "", "", ""]);
//   const [displayMode, setDisplayMode] = useState<'percentage' | 'count'>('percentage');
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const validOptions = answers.filter(opt => opt.trim() !== "");
//   const canSave = question.trim() !== "" && validOptions.length >= 2;

//   const handleChangeAnswer = (idx: number, value: string) => {
//     const copy = [...answers];
//     copy[idx] = value;
//     setAnswers(copy);
//   };

//   const handleSaveClick = () => setShowConfirm(true);
//   const handleConfirmSave = async () => {
//     setSaving(true);
//     try {
//       const pollData = {
//         question: question.trim(),
//         options: validOptions,
//         displayMode,
//         results: validOptions.map(() => 0),
//       };

//       await droppedAsset.setDataObject({ poll: pollData }, { lock: { lockId: droppedAsset.id, releaseLock: true } });
//       setShowConfirm(false);
//     } catch (error) {
//       console.error("Failed to save poll:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-4">Create or Update Poll</h2>

//       <label className="block mb-2">Question</label>
//       <input
//         className="input input-bordered w-full mb-4"
//         value={question}
//         onChange={e => setQuestion(e.target.value)}
//       />

//       <label className="block mb-2">Answers (min 2, max 5)</label>
//       {answers.map((ans, idx) => (
//         <input
//           key={idx}
//           className="input input-bordered w-full mb-2"
//           placeholder={`Option ${idx + 1}`}
//           value={ans}
//           onChange={e => handleChangeAnswer(idx, e.target.value)}
//         />
//       ))}

//       <label className="block mb-2 mt-4">Choose how results are displayed</label>
//       <select
//         className="select select-bordered w-full mb-6"
//         value={displayMode}
//         onChange={e => setDisplayMode(e.target.value as any)}
//       >
//         <option value="percentage">Percentage</option>
//         <option value="count">Number of Votes</option>
//       </select>

//       <button
//         className="btn btn-primary w-full"
//         disabled={!canSave || saving}
//         onClick={handleSaveClick}
//       >
//         {saving ? 'Saving...' : 'Save Poll'}
//       </button>

//       {showConfirm && (
//         <ConfirmationModal
//           message="This will overwrite the existing poll and reset all vote tallies. Continue?"
//           onCancel={() => setShowConfirm(false)}
//           onConfirm={handleConfirmSave}
//         />
//         )}
//     </div>
//   );
// };

// export default AdminView;

