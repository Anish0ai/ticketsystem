import { useState } from "react";
import API from "../../services/api";
import ModalWrapper from "../common/modalwrapper";

const StatusModal = ({ onClose }: any) => {
  const [form, setForm] = useState({ name: "", color: "" });

  const submit = async () => {
    await API.post("/status", form);
    onClose();
  };

  return (
    <ModalWrapper title="Status Creation" onClose={onClose}>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Color" onChange={(e)=>setForm({...form,color:e.target.value})}/>
      <button onClick={submit}>Create</button>
    </ModalWrapper>
  );
};

export default StatusModal;