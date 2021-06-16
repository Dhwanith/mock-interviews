import { useState } from "react";
import { useAuth, useInterviewSlot } from "../context";
import formStyles from "../styles/Auth.module.css";

export const AddInterviewSlot = () => {
  const [dateAndTime, setDateAndTime] = useState("");
  const { user, token } = useAuth();
  const { interviewSlotDispatch } = useInterviewSlot();

  const addInterviewSlot = async (e) => {
    e.preventDefault();
    console.log({ dateAndTime });
    const response = await fetch(`/api/interviewSlot/${user._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        dateAndTime,
      }),
    });

    const { data } = await response.json();
    console.log({ data });
    console.log(data.slots);
    if (data.success) {
      interviewSlotDispatch({
        type: "ADD_INTERVIEW_SLOT",
        payload: { slots: data.slots },
      });
    }
  };

  return (
    <div>
      <h1>Add New Interview Slot</h1>
      <form onSubmit={addInterviewSlot}>
        {/* <div className={formStyles.inputBox}> */}
        <input
          type='datetime-local'
          required
          className={formStyles.input}
          value={dateAndTime}
          onChange={(e) => setDateAndTime(() => e.target.value)}
        />
        <br />
        {/* <span className={formStyles.focusBorder}></span> */}
        {/* </div> */}
        <button className={formStyles.btnLogin} type='submit'>
          Add Slot
        </button>
      </form>
    </div>
  );
};