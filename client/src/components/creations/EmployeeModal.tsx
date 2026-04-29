import { useState } from "react";
import { api } from "../../api/api";
import ModalWrapper from "../common/ModalWrapper";
import React from "react";

const EmployeeModal = ({ onClose }: any) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    phone: ""
  });

  const submit = async () => {
    await api.post("/employees", form);
    alert("Employee Created");
    onClose();
  };

  return (
    <ModalWrapper title="Employee Creation" onClose={onClose}>
      <input placeholder="Name" onChange={(e)=>setForm({...form,name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setForm({...form,email:e.target.value})}/>
      <input placeholder="Role" onChange={(e)=>setForm({...form,role:e.target.value})}/>
      <input placeholder="Phone" onChange={(e)=>setForm({...form,phone:e.target.value})}/>
      <button onClick={submit}>Create</button>
    </ModalWrapper>
  );
};

export default EmployeeModal;