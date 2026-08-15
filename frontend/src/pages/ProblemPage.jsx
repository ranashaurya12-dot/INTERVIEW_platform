import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problem";
import Navbar from "../components/Navbar";

import {
  Group as PanelGroup,
  Panel,
  Separator as PanelResizeHandle,
} from "react-resizable-panels";

import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";

import { executeCode } from "../lib/piston";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState(
    id || "two-sum"
  );

  const [selectedLanguage, setSelectedLanguage] =
    useState("javascript");

  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript
  );

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // Update problem when URL changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id]);

  // Update starter code when language changes
  useEffect(() => {
    setCode(currentProblem.starterCode[selectedLanguage]);
    setOutput(null);
  }, [selectedLanguage]);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleProblemChange = (newProblemId) => {
    navigate(`/problem/${newProblemId}`);
  };

  // Confetti animation
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 200,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 120,
      spread: 200,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  // Normalize outputs for comparison
  const normalizeOutput = (value) => {
    return String(value)
      .trim()
      .replace(/\r\n/g, "\n")
      .replace(/\s+/g, "");
  };

  // Generic checker for ALL problems
  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    return (
      normalizeOutput(actualOutput) ===
      normalizeOutput(expectedOutput)
    );
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    try {
      const result = await executeCode(selectedLanguage, code);

      setOutput(result);

      if (result.success) {
        const expectedOutput =
          currentProblem.expectedOutput[selectedLanguage];

        console.log("Actual:", result.output);
        console.log("Expected:", expectedOutput);

        const testsPassed = checkIfTestsPassed(
          result.output,
          expectedOutput
        );

        if (testsPassed) {
          triggerConfetti();
          toast.success("🎉 Accepted! All test cases passed");
        } else {
          toast.error("❌ Wrong Answer");
        }
      } else {
        toast.error("⚠️ Code execution failed");
      }
    } catch (error) {
      console.error(error);

      setOutput({
        success: false,
        error: error.message,
      });

      toast.error("Execution error");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup orientation="horizontal">
          {/* LEFT PANEL */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup orientation="vertical">
              {/* CODE EDITOR */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* OUTPUT PANEL */}
              <Panel defaultSize={30} minSize={20}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;