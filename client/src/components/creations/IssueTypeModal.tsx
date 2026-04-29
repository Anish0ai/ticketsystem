import { useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import Input from "../common/Input";
import Button from "../common/Button";
import { api } from "../../api/api";
import React from "react";

interface Props {
  onClose: () => void;
}

const IssueTypeModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      await api.post("/issue-type", { name });
      alert("Issue Type Created ✅");
      onClose();
    } catch (error) {
      console.error("Error creating issue type:", error);
    }
  };

  return (
    <ModalWrapper title="Issue Type Creation" onClose={onClose}>
      
      {/* Input */}
      <Input
        placeholder="Enter Issue Type"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Button */}
      <Button label="Create" onClick={handleSubmit} />

    </ModalWrapper>
  );
};

export default IssueTypeModal;