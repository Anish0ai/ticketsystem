import { useState } from "react";
import API from "../../services/api";
import ModalWrapper from "../common/modalwrapper";

const PriorityModal = ({ onClose }: any) => {
  const [form, setForm] = useState({ name: "", color: "" });

  const submit = async () => {
    await API.post("/priority", form);
    onClose();
  };

  return (
    <ModalWrapper title="Priority Creation" onClose={onClose}>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Color" onChange={(e)=>setForm({...form,color:e.target.value})}/>
      <button onClick={submit}>Create</button>
    </ModalWrapper>
  );
};

export default PriorityModal;