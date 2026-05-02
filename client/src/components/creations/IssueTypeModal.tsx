import { useState } from "react";
import ModalWrapper from "../common/modalwrapper";
import Input from "../common/Input";
import Button from "../common/Button";
import API from "../../services/api";

interface Props {
  onClose: () => void;
}

const IssueTypeModal: React.FC<Props> = ({ onClose }) => {
  const [name, setName] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/issue-type", { name });
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