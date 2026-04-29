import { useState } from "react";
import { api } from "../../api/api";
import ModalWrapper from "../common/ModalWrapper";
import React from "react";

const RoleModal = ({ onClose }: any) => {
  const [role, setRole] = useState("");

  const submit = async () => {
    await api.post("/roles", { name: role });
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