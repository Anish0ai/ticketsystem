import { useState } from "react";
import ModalWrapper from "../common/ModalWrapper";
import Input from "../common/Input";
import Button from "../common/Button";
import { api } from "../../api/api";
import React from "react";

interface Props {
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ onClose }) => {
  const [step, setStep] = useState(1);

  // Step 1 data
  const [project, setProject] = useState({
    name: "",
    platform: "",
    tech: "",
    description: "",
  });

  // Step 2 data
  const [team, setTeam] = useState({
    head: "",
    member: "",
    reviewer: "",
  });

  // NEXT STEP
  const handleNext = () => {
    if (!project.name) return alert("Project name required");
    setStep(2);
  };

  // SUBMIT
  const handleSubmit = async () => {
    try {
      await api.post("/projects", {
        ...project,
        ...team,
      });

      alert("Project Created ✅");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ModalWrapper title="Project Creation" onClose={onClose}>
      
      {/* STEP 1 */}
      {step === 1 && (
        <>
          <Input
            placeholder="Project Name"
            value={project.name}
            onChange={(e) =>
              setProject({ ...project, name: e.target.value })
            }
          />

          <Input
            placeholder="Platform"
            value={project.platform}
            onChange={(e) =>
              setProject({ ...project, platform: e.target.value })
            }
          />

          <Input
            placeholder="Tech Stack"
            value={project.tech}
            onChange={(e) =>
              setProject({ ...project, tech: e.target.value })
            }
          />

          <Input
            placeholder="Description"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />

          <Button label="Next" onClick={handleNext} />
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <Input
            placeholder="Project Head"
            value={team.head}
            onChange={(e) =>
              setTeam({ ...team, head: e.target.value })
            }
          />

          <Input
            placeholder="Team Member"
            value={team.member}
            onChange={(e) =>
              setTeam({ ...team, member: e.target.value })
            }
          />

          <Input
            placeholder="Reviewer"
            value={team.reviewer}
            onChange={(e) =>
              setTeam({ ...team, reviewer: e.target.value })
            }
          />

          <Button label="Create Project" onClick={handleSubmit} />
        </>
      )}
    </ModalWrapper>
  );
};

export default ProjectModal;