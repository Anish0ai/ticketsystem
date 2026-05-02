import { useState } from "react";
import API from "../../services/api";
import ModalWrapper from "../common/modalwrapper";

const RoleModal = ({ onClose }: any) => {
  const [role, setRole] = useState("");

  const submit = async () => {
    await API.post("/roles", { name: role });
    onClose();
  };

  return (
    <ModalWrapper title="Role Creation" onClose={onClose}>
      <input placeholder="Role Name" onChange={(e)=>setRole(e.target.value)} />
      <button onClick={submit}>Create</button>
    </ModalWrapper>
  );
};

export default RoleModal;